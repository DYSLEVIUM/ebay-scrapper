import sys

from modules.scrappers import BaseScrapper, EbayScrapper
from modules.utils.config import config, get_base_path
from modules.utils.logger import logger


def scrape(target_price: float, keywords: list[str]) -> None:
    # don't do anything if we have no keywords
    if len(keywords) == 0:
        return

    logger.info("Starting web scraping job.")

    # TODO: Initiate proxy manager, ip rotation manager

    # extensible to add more scrappers later
    scrappers: list[BaseScrapper] = [
        EbayScrapper(
            keywords=keywords,
            target_price=target_price,
            max_pages=config.getint("SCRAPPER", "MAX_PAGES"),
        )
    ]

    try:
        for scrapper in scrappers:
            scrapper.scrape()
            logger.info(f"Scrapping for {scrapper.base_domain} done.")
    except Exception as e:
        logger.exception(f"Error: {str(e)}.")


if __name__ == "__main__":
    scrape(float(sys.argv[1]), sys.argv[2:])
    logger.info("Done Scrapping.")
