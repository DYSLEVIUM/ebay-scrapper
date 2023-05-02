class Product:
    def __init__(
        self,
        is_new_listing: bool,
        title: str,
        link: str,
        image_link: str,
        condition: str | None,
        price: float,
        shipping_price: float | None = None,
    ) -> None:
        self.is_new_listing = is_new_listing
        self.title = title
        self.link = link
        self.image_link = image_link
        self.condition = condition
        self.price = price
        self.shipping_price = shipping_price

    def __eq__(self, other):
        return (
            isinstance(other, self.__class__)
            and getattr(other, "is_new_listing", None) == self.is_new_listing
            and getattr(other, "title", None) == self.title
            and getattr(other, "link", None) == self.link
            and getattr(other, "image_link", None) == self.image_link
            and getattr(other, "condition", None) == self.condition
            and getattr(other, "price", None) == self.price
            and getattr(other, "shipping_price", None) == self.shipping_price
        )

    def __hash__(self):
        return hash(
            ", ".join(
                filter(
                    None,
                    map(
                        str,
                        [
                            self.is_new_listing,
                            self.title,
                            # self.link, # we are sometimes getting extra parameters in the link, making it different
                            self.image_link,
                            self.condition,
                            self.price,
                            self.shipping_price,
                        ],
                    ),
                )
            )
        )

    def __eq__(self, other):
        if isinstance(other, Product):
            return self.__hash__() == other.__hash__()
        else:
            return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def __str__(self):
        return f"New Listing: {self.is_new_listing}\nTitle: {self.title}\nLink: {self.link}\nImage Link: {self.image_link}\nCondition: {self.condition}\nPrice: ${self.price}\nShipping Price: ${self.shipping_price}\nHash: {self.__hash__()}\n"
