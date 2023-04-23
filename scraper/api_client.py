import logging
import requests

from models.event import Event


class ApiClient:
    def __init__(self, api_key, base_url="http://localhost:8080/api") -> None:
        self.api_key = api_key
        self.base_url = base_url
        self.logger = logging.getLogger(__name__)

    def prepare_headers(self):
        return {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}'
        }

    def create_event(self, event: Event):
        self.logger.debug(f"creating event {event.identifier}")
        event_dict = event.get_json_dict()

        response = requests.post(f"{self.base_url}/events", headers=self.prepare_headers(), json=event_dict)
        json = response.json()

        if response.status_code != 200:
            message = json["message"]
            self.logger.warning(f"create event {event.identifier} failed with message '{message}' and status code {response.status_code}")

        return json

    def update_event(self, event: Event):
        self.logger.debug(f"updating event {event.identifier}")
        # TODO: implement update

        pass

    def get_events(self, page=0, identifier=None):
        query_params = {"page": page}
        if identifier:
            query_params["identifier"] = identifier

        response = requests.get(f"{self.base_url}/events", headers=self.prepare_headers(), params=query_params).json()

        return response["events"]

    def create_or_update_event(self, event: Event):
        existing_events = self.get_events(identifier=event.identifier)
        if len(existing_events) == 0:
            self.create_event(event)

            return

        self.update_event(event)

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
