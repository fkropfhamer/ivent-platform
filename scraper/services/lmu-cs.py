import requests
from bs4 import BeautifulSoup
from api_client import api_client


def main():
    r = requests.get("https://www.lmu.de/de/workspace-fuer-studierende/career-service/career-community-events/career-und-networking-events/index.html")
    print(r.status_code)

    soup = BeautifulSoup(r.text, features="html.parser")
    
    table_rows = soup.find_all('tr')

    print(len(table_rows))

    for table_row in table_rows:    
        children = table_row.find_all("td")


        if len(children) != 5:
            continue

        date, name, _, time, who = children

        print(date.text, name.text, time.text, who.text)

        createEvent(name.text)

        

def createEvent(name):
    api_client.create_event(name)

if __name__ == '__main__':
    main()