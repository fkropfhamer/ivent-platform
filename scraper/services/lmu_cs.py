import requests
from bs4 import BeautifulSoup
import logging


def scrape_lmu_cs(api_client, dry_run=False):
    logger = logging.getLogger(__name__)
    logger.info("start scraping lmu-cs")

    r = requests.get(
        "https://www.lmu.de/de/workspace-fuer-studierende/career-service/career-community-events/career-und-networking-events/index.html")

    soup = BeautifulSoup(r.text, features="html.parser")
    table_rows = soup.find_all('tr')

    for table_row in table_rows:
        children = table_row.find_all("td")

        if len(children) != 5:
            continue

        date, name, _, time, who = children

        logger.debug(f"{date.text}, {name.text}, {time.text}, {who.text}")

    logger.info("finished scraping lmu-cs")
