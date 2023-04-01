from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from models.event import Event


def scrape_staatsoper(api_client, dry_run=False):
    logger = logging.getLogger(__name__)
    logger.info("Start scrapping staatsoper")

    # Create a new instance of the Chrome driver
    options = webdriver.FirefoxOptions()
    options.add_argument('-headless')
    driver = webdriver.Firefox(options=options)

    # Navigate to the website
    url = "https://www.staatsoper.de/spielplan/"
    driver.get(url)

    # Wait for the page to load and for the cookie consent banner to disappear
    wait = WebDriverWait(driver, 10)
    consent_banner = wait.until(EC.invisibility_of_element_located((By.ID, "cookie-consent")))

    # Parse the HTML with BeautifulSoup
    soup = BeautifulSoup(driver.page_source, "html.parser")

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
                date = group_row['data-date']
                location_text = group_row.find('div', class_='activity-list__text').find('span').text
                location = location_text.split("|")[1].strip()

                price_info = group_row.find('p', class_='activity-list-price-info').find('span').text.strip().replace("\n", "")
                organizer = "Bayerische Staatsoper"
                link = "https://www.staatsoper.de" + group_row.find('a', class_='activity-list__content')['href']

                event = Event(name=name, date=date, location=location, price_info=price_info, organizer=organizer, link=link)
                logger.debug(event)
                events.append(event)

                if not dry_run:
                    api_client.create_event(event)

        current_month += timedelta(days=30)

    # Close the browser
    driver.quit()

    logger.info("finished scrapping staatsoper")
