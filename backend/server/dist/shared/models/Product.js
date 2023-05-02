"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const file_1 = require("../utils/file");
class Product {
    constructor(product) {
        this.is_new_listing = product.is_new_listing;
        this.title = product.title;
        this.link = product.link;
        this.image_link = product.image_link;
        this.condition = product.condition;
        this.price = product.price;
        this.shipping_price = product.shipping_price;
    }
    equals(other) {
        return (this.is_new_listing === other.is_new_listing &&
            this.title === other.title &&
            this.condition === other.condition &&
            this.price === other.price &&
            this.shipping_price === other.shipping_price);
    }
    static exportToCsv(products, filePath) {
        const headings = Object.keys(products.length ? products[0] : {});
        // Convert products to an array of plain objects
        const productData = products.map((product) => {
            const productObject = {}; // Use 'any' type for dynamic assignment
            // Assign values to the properties dynamically
            Object.keys(product).forEach((key) => {
                const value = product[key];
                let formattedValue;
                if (value === null) {
                    formattedValue = 'Null,'; // Convert null
                }
                else if (typeof value === 'string') {
                    // formattedValue = `"${value}"`; // Enclose string in double quotes if it contains a comma
                    // formattedValue = `"${value.replace(/"/g, '""')}"`; // Escape double quotes within the string
                    if (value.includes(',') || value.includes('"')) {
                        formattedValue = `"${value.replace(/"/g, '""')}"`; // Escape double quotes and enclose within double quotes
                    }
                    else {
                        formattedValue = value;
                    }
                }
                else {
                    formattedValue = String(value);
                }
                productObject[key] = formattedValue;
                // productObject[key] = value !== null ? String(value) : 'Null,'; // Convert null
            });
            return productObject;
        });
        // Prepend the headings to the data array
        const dataWithHeadings = [headings, ...productData];
        return (0, file_1.writeCsvFile)(filePath, dataWithHeadings);
    }
}
exports.Product = Product;
