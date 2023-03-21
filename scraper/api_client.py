import requests
from config import token


class ApiClient:
    def __init__(self, api_key, base_url="http://localhost:8080/api") -> None:
        self.api_key = api_key
        self.base_url = base_url

    def prepare_headers(self):
        return {
            'Content-Type':'application/json',
            'Authorization': f'Bearer {self.api_key}'
        }

    def create_event(self, name):
        json = {
            "name": name
        }

        response = requests.post(f"{self.base_url}/events", headers=self.prepare_headers(), json=json).json()

        return response

    def get_events(self, page=0):
        response = requests.get(f"{self.base_url}/events?page={page}", headers=self.prepare_headers()).json()

        return response["events"]
    

    def get_all_events(self):
        page = 0
        response = requests.get(f"{self.base_url}/events?page={page}", headers=self.prepare_headers()).json()

        total = response["count"]
        events = response["events"]

        while len(events) < total:
            page += 1
            next_events = self.get_events(page=page)

            events = [*events, *next_events]

        return events


api_client = ApiClient(token)