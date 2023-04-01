import argparse as argparse
import logging
import sys

from api_client import ApiClient
from services.lmu_cs import scrape_lmu_cs
from services.staatsoper import scrape_staatsoper


def main():
    parser = argparse.ArgumentParser(prog='ivent-scraper')
    parser.add_argument('scraper')
    parser.add_argument('-d', '--dry_run', action='store_true')
    parser.add_argument('--debug', action='store_true')

    args = parser.parse_args()

    run(args.scraper, args.dry_run, debug=args.debug)


def run(scraper_name, dry_run=False, debug=False):
    logging.basicConfig(stream=sys.stdout, level=logging.DEBUG if debug else logging.INFO)

    api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjEyMzQsImlkIjoiNjQxOTk4ZjJmMmJmOTExOGIxY2Y2ODZhIiwicm9sZSI6IlJPTEVfU0VSVklDRSJ9.9bILzNjF1D0v0giNqBwhwcqU9aWEBiVuvHq8E7eHD00"
    api_client = ApiClient(api_key)

    scrapers = {
        'staatsoper': scrape_staatsoper,
        'lmu-cs': scrape_lmu_cs
    }

    if scraper_name == 'all':
        logging.info("running all scrapers")
        for scraper in scrapers.values():
            scraper(api_client, dry_run=dry_run)

        return

    if scraper_name not in scrapers:
        logging.error(f'{scraper_name} scraper not available')
        return

    scrapers[scraper_name](api_client, dry_run=dry_run)


if __name__ == '__main__':
    main()
