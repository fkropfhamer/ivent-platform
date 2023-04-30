import logging
import pytz
from datetime import datetime, timedelta

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from scraper.models.event import Event


def scrape_staatsoper(api_client, dry_run=False):
    logger = logging.getLogger(__name__)
    logger.info("start scraping staatsoper")

    # Create a new instance of the Chrome driver
    options = webdriver.FirefoxOptions()
    options.add_argument('-headless')
    driver = webdriver.Firefox(options=options)

    # Navigate to the website
    url = "https://www.staatsoper.de/spielplan/"
    driver.get(url)

    # Wait for the page to load and for the cookie consent banner to disappear
    wait = WebDriverWait(driver, 10)
    wait.until(EC.invisibility_of_element_located((By.ID, "cookie-consent")))

    events = []

    # Scrape events from current month's page and the next 11 months
    current_month = datetime.now().date().replace(day=1)
    for i in range(12):
        month_url = current_month.strftime("https://www.staatsoper.de/spielplan/%Y-%m")
        driver.get(month_url)
        soup = BeautifulSoup(driver.page_source, "html.parser")

        activity_groups = soup.find_all('div', class_='activity-group')
        for group in activity_groups:
            group_rows = group.find_all('div', class_='activity-list__row')
            for group_row in group_rows:
                name = group_row.find('h3').text.strip()

                time_and_location_text = group_row.find('div', class_='activity-list__text').find('span').text
                location = time_and_location_text.split("|")[1].strip()
                date = group_row['data-date']
                start = build_start_datetime(date, time_and_location_text)

                category_text = group_row.find('div', class_='activity-list__channel hide-on-md').text.strip()
                category = determine_category(category_text)
                price_info = group_row.find('p', class_='activity-list-price-info').find('span').text.strip()\
                    .replace("\n", "")
                organizer = "Bayerische Staatsoper"
                link = "https://www.staatsoper.de" + group_row.find('a', class_='activity-list__content')['href']

                identifier = group_row.find('input', class_='activity-list--toggle')['value']

                event = Event(name=name, start=start, location=location, price_info=price_info, organizer=organizer,
                              link=link, identifier=identifier, category=category)
                logger.debug(event)
                events.append(event)

                if not dry_run:
                    api_client.create_or_update_event(event)

        current_month += timedelta(days=30)

    # Close the browser
    driver.quit()

    logger.info(f"scraped {len(events)} events")
    logger.info("finished scrapping staatsoper")


def build_start_datetime(date, time_and_location_text):
    time = time_and_location_text.split("|")[0].strip()[:5]
    return datetime.strptime(date + " " + time, "%Y-%m-%d %H.%M").astimezone(pytz.timezone('Europe/Berlin'))


def determine_category(category_text):
    main_event_types = ["ballett", "oper", "konzert"]
    if category_text.lower() in main_event_types:
        category = category_text.title()
    else:
        category = "Staatsoper_Extra"
    return category
