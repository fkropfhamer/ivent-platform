class Event:
    def __init__(self, name, start=None, end=None, identifier=None, location=None, price_info=None,
                 organizer=None, link=None, description=None, category=None):
        self.name = name
        self.start = start
        self.end = end
        self.location = location
        self.price_info = price_info
        self.organizer = organizer
        self.link = link
        self.identifier = identifier
        self.description = description
        self.category = category

    def __str__(self):
        return f"Event: {self.name}\nStart: {self.start}\nLocation: {self.location}\nPrice Info: {self.price_info}\n" \
               f"Organizer: {self.organizer}\nLink: {self.link}"

    def get_json_dict(self):

        end = self.end

        if self.end is not None:
            end = self.end.isoformat()

        return {
            "name": self.name,
            "start": self.start.isoformat(),
            "end": end,
            "location": self.location,
            "price_info": self.price_info,
            "organizer": self.organizer,
            "link": self.link,
            "identifier": self.identifier,
            "description": self.description,
            "category": self.category
        }
