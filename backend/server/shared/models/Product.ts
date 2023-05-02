import { IProduct } from '../interfaces';
import { writeCsvFile } from '../utils/file';

export class Product implements IProduct {
    is_new_listing: boolean;
    title: string;
    link: string;
    image_link: string;
    condition: string | null;
    price: number;
    shipping_price: number | null;

    [key: string]: any;

    constructor(product: IProduct) {
        this.is_new_listing = product.is_new_listing;
        this.title = product.title;
        this.link = product.link;
        this.image_link = product.image_link;
        this.condition = product.condition;
        this.price = product.price;
        this.shipping_price = product.shipping_price;
    }

    equals(other: Product): boolean {
        return (
            this.is_new_listing === other.is_new_listing &&
            this.title === other.title &&
            this.condition === other.condition &&
            this.price === other.price &&
            this.shipping_price === other.shipping_price
        );
    }

    static async exportToCsv(
        products: Product[],
        filePath: string
    ): Promise<string> {
        const headings = Object.keys(products.length ? products[0] : {});

        // Convert products to an array of plain objects
        const productData = products.map((product) => {
            const productObject: any = {}; // Use 'any' type for dynamic assignment

            // Assign values to the properties dynamically
            Object.keys(product).forEach((key) => {
                const value = product[key];
                let formattedValue: string;

                if (value === null) {
                    formattedValue = 'Null,'; // Convert null
                } else if (typeof value === 'string') {
                    // formattedValue = `"${value}"`; // Enclose string in double quotes if it contains a comma
                    // formattedValue = `"${value.replace(/"/g, '""')}"`; // Escape double quotes within the string
                    if (value.includes(',') || value.includes('"')) {
                        formattedValue = `"${value.replace(/"/g, '""')}"`; // Escape double quotes and enclose within double quotes
                    } else {
                        formattedValue = value;
                    }
                } else {
                    formattedValue = String(value);
                }

                productObject[key] = formattedValue;
                // productObject[key] = value !== null ? String(value) : 'Null,'; // Convert null
            });

            return productObject;
        });

        // Prepend the headings to the data array
        const dataWithHeadings = [headings, ...productData];

        return await writeCsvFile(filePath, dataWithHeadings);
    }
}
