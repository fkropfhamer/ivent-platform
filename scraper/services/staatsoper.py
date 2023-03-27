from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from scraper.models.event import Event

# Create a new instance of the Chrome driver
options = webdriver.ChromeOptions()
options.add_argument('start-maximized')
driver = webdriver.Chrome(options=options)

# Navigate to the website
url = "https://www.staatsoper.de/spielplan/"
driver.get(url)

# Wait for the page to load and for the cookie consent banner to disappear
wait = WebDriverWait(driver, 10)
consent_banner = wait.until(EC.invisibility_of_element_located((By.ID, "cookie-consent")))

# Parse the HTML with BeautifulSoup
soup = BeautifulSoup(driver.page_source, "html.parser")

events = []

activity_groups = soup.find_all('div', class_='activity-group')
for group in activity_groups:
    group_rows = group.find_all('div', class_='activity-list__row')
    for group_row in group_rows:
        name = group.find('h3').text.strip()
        date = group_row['data-date']
        location_text = group.find('div', class_='activity-list__text').find('span').text
        location = location_text.split("|")[1].strip()

        price_info = group.find('p', class_='activity-list-price-info').find('span').text.strip().replace("\n", "")
        organizer = "Bayerische Staatsoper"
        link = "https://www.staatsoper.de" + group.find('a', class_='activity-list__content')['href']

        event = Event(name=name, date=date, location=location, price_info=price_info, organizer=organizer, link=link)
        print(event)
        events.append(event)

# Close the browser
driver.quit()
