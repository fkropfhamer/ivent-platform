import datetime
from urllib.parse import urlparse, parse_qs
import requests
from bs4 import BeautifulSoup
import logging
import pytz

from scraper.api_client import ApiClient
from scraper.models.event import Event


def scrape_lmu_cs(api_client: ApiClient, dry_run=False):
    logger = logging.getLogger(__name__)
    logger.info("start scraping lmu-cs")

    r = requests.get("https://www.matorixmatch.de/tandem//index.php?mand_id=15")

    soup = BeautifulSoup(r.text, features="html.parser")
    appointment_box = soup.find('div', class_="terminbox_news")
    appointments = list(appointment_box.children)[0].find_all('div')

    event_type_blacklist = ["LMU Talentpool", "CV Check"]

    count = 0
    for appointment in appointments:
        table_cell = appointment.find('div')
        if not table_cell:
            continue
        infos = table_cell.find_all('p')

        date_info = infos[0].text.strip()
        event_type = infos[1].text.strip()
        name = infos[2].text
        location = infos[3].text

        if event_type in event_type_blacklist:
            continue

        description = None
        if len(infos) == 5:
            description = infos[4].text

        registration_link = table_cell.find('a')['href']

        start_date, end_date = parse_event_date(date_info)
        start_date = start_date.astimezone(pytz.timezone('Europe/Berlin'))
        end_date = end_date.astimezone(pytz.timezone('Europe/Berlin'))
        identifier = extract_identifier_from_registration_link(registration_link)

        event = Event(name=name, start=start_date, end=end_date, identifier=identifier, link=registration_link,
                      location=location, organizer="LMU Career Service", description=description, category="LMU-CS_" + event_type)
        count += 1

        if not dry_run:
            api_client.create_or_update_event(event)

    logger.info(f"scraped {count} events")
    logger.info("finished scraping lmu-cs")


def parse_event_date(date_string):
    start_string, end_string = date_string.split("-")
    end_string = end_string.strip()
    start_string = start_string.strip()

    start = parse_full_date_string(start_string)

    if end_string[0].isalpha():
        end = parse_full_date_string(end_string)
    else:
        hour, minute = end_string.split(":")
        end = start.replace(hour=int(hour), minute=int(minute))

    return start, end


def parse_full_date_string(date_string: str):
    _, date = date_string.split(" ", maxsplit=1)

    return datetime.datetime.strptime(date, "%d.%m.%Y %H:%M")


def extract_identifier_from_registration_link(url: str):
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)

    redirect = query_params["redirect"][0]

    parsed_url = urlparse(redirect)
    query_params = parse_qs(parsed_url.query)

    return query_params["termin_id"][0]
