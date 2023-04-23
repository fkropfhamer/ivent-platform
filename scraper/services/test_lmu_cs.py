import datetime
from unittest import TestCase

from services.lmu_cs import parse_event_date, parse_full_date_string, extract_identifier_from_registration_link


class Test(TestCase):
    def test_parse_event_date(self):
        test_cases = [
            ("Mo 17.04.2023 00:00 - Fr 21.07.2023 23:55", datetime.datetime(2023, 4, 17, 0, 0),
             datetime.datetime(2023, 7, 21, 23, 55)),
            ("Fr 28.04.2023 13:30 - 17:30", datetime.datetime(2023, 4, 28, 13, 30),
             datetime.datetime(2023, 4, 28, 17, 30))
        ]

        for date_string, start, end in test_cases:
            start_date, end_date = parse_event_date(date_string)

            self.assertEqual(start_date, start)
            self.assertEqual(end_date, end)

    def test_parse_full_date_string(self):
        self.assertEqual(parse_full_date_string("Fr 28.04.2023 13:30"), datetime.datetime(2023, 4, 28, 13, 30))
        self.assertEqual(parse_full_date_string("Mo 19.12.2018 10:00"), datetime.datetime(2018, 12, 19, 10, 00))
        self.assertEqual(parse_full_date_string("Sun 03.01.2025 21:30"), datetime.datetime(2025, 1, 3, 21, 30))

    def test_extract_identifier_from_registration_link(self):
        self.assertEqual(extract_identifier_from_registration_link("https://www.matorixmatch.de/tandem//index.php?mand_id=15&redirect=kalender.php%3Forg_id%3D0%26kalender_id%3D16%26termin_id%3D3300%26slot_nr%3D1&newcomer=1&lang=de_DE"), "3300")
        self.assertEqual(extract_identifier_from_registration_link("https://www.matorixmatch.de/tandem//index.php?mand_id=15&redirect=kalender.php%3Forg_id%3D0%26kalender_id%3D16%26termin_id%3D3062%26slot_nr%3D1&newcomer=1&lang=de_DE"), "3062")
