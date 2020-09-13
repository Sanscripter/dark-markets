import Item from './Item';
import Product from './Product';

export default class Offers {
    products: {
        [key: string]: Product
    } = {};

    constructor() { }

    add(product: Product) {
        //If we have to create a new product, we'll return it whole, if it's just stackign quantities, we'll return the qty
        if (!this.hasProduct(product)) {
            this.products[product.getId()] = product;
            return this.products[product.getId()];
        }
        //@ts-ignore
        const newQty = this.products[product.getId()].getQuantity() + product.getQuantity();
        this.products[product.getId()].setQuantity(newQty);
        return this.products[product.getId()].getQuantity();
    }

    remove(product: Product) {
        //If there is no item, there's nothing to return, otherwise, return qty (even if it is negative??)
        const stockedProduct = this.hasProduct(product)
        if (!stockedProduct) {
            return null;
        }

        const newQty = this.products[product.getId()].getQuantity() - product.getQuantity();
        this.products[product.getId()].setQuantity(newQty);

        if (!this.products[product.getId()].getQuantity()) {
            delete this.products[product.getId()];
        }

        return newQty;
    }

    hasProduct(product: Product) {
        return this.products[product.getId()];
    }

    getProduct(id: string) {
        const item = new Item();
        item.id = id;
        const product = new Product(item);
        return this.hasProduct(product);
    }

}