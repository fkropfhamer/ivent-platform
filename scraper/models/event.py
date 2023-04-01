class Event:
    def __init__(self, name, date=None, location=None, price_info=None, organizer=None, link=None):
        self.name = name
        self.date = date
        self.location = location
        self.price_info = price_info
        self.organizer = organizer
        self.link = link

    def __str__(self):
        return f"Event: {self.name}\nDate: {self.date}\nLocation: {self.location}\nPrice Info: {self.price_info}\n" \
               f"Organizer: {self.organizer}\nLink: {self.link}"
