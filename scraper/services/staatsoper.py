from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

# Create a new instance of the Firefox driver
options = webdriver.ChromeOptions()
options.add_argument('start-maximized')
driver = webdriver.Chrome(options=options)

# Navigate to the website
driver.get("https://www.staatsoper.de/spielplan/")

# Wait for the page to load and for the cookie consent banner to disappear
wait = WebDriverWait(driver, 10)
consent_banner = wait.until(EC.invisibility_of_element_located((By.ID, "cookie-consent")))

# Parse the HTML with BeautifulSoup
soup = BeautifulSoup(driver.page_source, "html.parser")

events = []

activity_groups = soup.find_all('div', class_='activity-group')
for group in activity_groups:
    group_events = []
    for event in group.find_all('h3'):
        events.append(event.text.strip())
print(events)

# Close the browser
driver.quit()
