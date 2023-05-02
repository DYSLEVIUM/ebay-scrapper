from abc import ABC, abstractmethod, abstractproperty


class BaseScrapper(ABC):
    @staticmethod
    @property
    @abstractproperty
    def base_domain(self):
        pass

    @staticmethod
    @property
    @abstractproperty
    def page_number(self):
        pass

    @staticmethod
    @property
    @staticmethod
    def page_start(self) -> int:
        pass

    def __init__(
        self, keywords: list[str], target_price: float, max_pages: int
    ) -> None:
        self.keywords = keywords
        self.target_price = target_price
        self.parsed_keywords = self.parse_keywords(keywords)
        self.max_pages = max_pages

    @staticmethod
    @abstractmethod
    def parse_keywords(keywords: list[str]):
        pass

    @abstractmethod
    def get_url() -> str:
        pass

    @abstractmethod
    def next_page(self) -> None:
        pass

    @abstractmethod
    def scrape():
        pass
