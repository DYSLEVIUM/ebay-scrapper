export default interface IProduct {
    is_new_listing: boolean;
    title: string;
    link: string;
    image_link: string;
    condition: string | null;
    price: number;
    shipping_price: number | null;
}
