import os
import time
from random import uniform

from ..models import Product
from ..utils import config, is_float, make_csv, make_soup
from ..utils.config import get_base_path
from ..utils.logger import logger
from .base_scrapper import BaseScrapper


class EbayScrapper(BaseScrapper):
    @property
    @staticmethod
    def base_domain(self) -> str:
        return self.domain

    @property
    @staticmethod
    def page_start(self) -> int:
        return self.page_st

    @property
    @staticmethod
    def page_number(self) -> int:
        return self.page_num

    def __init__(
        self, keywords: list[str], target_price: float, max_pages: int
    ) -> None:
        super().__init__(keywords, target_price, max_pages)

        self.domain = "https://ebay.com"
        self.page_st = 1

        self.page_num = self.page_st

    @staticmethod
    def parse_keywords(keywords: list[str]) -> str:
        return "+".join(keywords)

    def next_page(self) -> int:
        self.page_num += 1
        return self.page_num

    def get_url(self) -> str:
        if self.page_num == self.page_st:
            url = f"{self.domain}/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313&_nkw={self.parsed_keywords}&sacat=0&pgn={self.page_num}&rt=nc"
        else:
            url = f"{self.domain}/sch/i.html?_from=R40&_nkw={self.parsed_keywords}&sacat=0&_pgn={self.page_num}&rt=nc"
        return url

    def scrape(self) -> None:
        products_set = set()
        while True:
            if self.page_num != self.page_st:
                wait_time = uniform(
                    0.5, config.getint("SCRAPPER", "MAX_SLEEP_BETWEEN_PAGES")
                )
                logger.info(f"Waiting for {wait_time} seconds.")
                time.sleep(wait_time)

            logger.info(
                f'Scrapping {self.get_url()} for "{self.parsed_keywords}" with target price of ${self.target_price}'
            )
            soup = make_soup(self.get_url())

            # first one is "Shop on eBay"
            products = soup.find_all("li", {"class": "s-item"})[1:]
            for product in products:
                # title
                title_div = product.find("div", {"class": "s-item__title"})
                inner_span = title_div.find("span", {"class": "LIGHT_HIGHLIGHT"})

                # is_new_listing
                is_new_listing = False

                if inner_span:
                    # removing the "NEW LISTING" span
                    inner_span.decompose()
                    is_new_listing = True

                title = title_div.find("span", {"role": "heading"}).get_text()

                # link
                link_anchor = product.find("a", {"class": "s-item__link"})
                link = link_anchor["href"]

                # image
                image_div = product.find("div", {"class": "s-item__image-wrapper"})
                image_link = image_div.img["src"]

                # condition
                if (
                    condition_span := product.find("span", {"class": "SECONDARY_INFO"})
                ) is not None:
                    condition = condition_span.get_text()
                else:
                    condition = None

                # price
                # sometimes it is in range like $14.22 to $19.64
                price_span_text = (
                    product.find("span", {"class": "s-item__price"})
                    .get_text()
                    .split(" ")
                )
                if len(price_span_text) == 1:
                    price = price_span_text[0]
                else:
                    price = price_span_text[2]  # we take higher side of the range
                price = float(price[1:].replace(",", ""))

                # shipping
                shipping_span_text = (
                    product.find("span", {"class": "s-item__shipping"})
                    .get_text()
                    .split(" ")
                )
                if is_float(shipping_span_text[0][2:]):
                    shipping_price = float(shipping_span_text[0][2:].replace(",", ""))
                else:
                    shipping_price = None

                if price <= self.target_price:
                    products_set.add(
                        Product(
                            is_new_listing=is_new_listing,
                            title=title,
                            link=link,
                            image_link=image_link,
                            condition=condition,
                            price=price,
                            shipping_price=shipping_price,
                        )
                    )

            pagination_items = soup.find_all("a", {"class": "pagination__item"})
            if pagination_items is None or len(pagination_items) == 0:
                break
            last_page = int(pagination_items[-1].get_text())

            if self.page_num >= min(self.max_pages, last_page):
                break

            self.next_page()

        make_csv(products_set, os.path.join(get_base_path(), "output.csv"))
