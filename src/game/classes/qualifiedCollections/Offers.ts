import Item from './qualifiedItems/Item';
import Product from './qualifiedItems/Product';

export default class Offers {
    products: Product[] = [];
    


    add(product: Product) {
        if (product.getQuantity() < 1) {
            return; //don't add 0 quantity products
        }

        const indx = this.hasProduct(product);
        if (indx < 0) {
            this.products.push(product);
            return this.products[this.products.length - 1];
        }

        const newQty = this.products[indx].getQuantity() + product.getQuantity();
        this.products[indx].setQuantity(newQty);
        return this.products[indx];
    }

    remove(product: Product) {
        if (product.getQuantity() < 1) {
            return; //don't remove 0 quantity products
        }

        const indx = this.hasProduct(product);
        if (indx < 0) {
            return;
        }

        const newQty = this.products[indx].getQuantity() - product.getQuantity();
        if (newQty < 1) {
            this.products.splice(indx, 1);
            return;
        }

        this.products[indx].setQuantity(newQty);
        return newQty;
    }

    hasProduct(product: Product) {
        return this.products.findIndex((p) => p.getId() == product.getId());
    }

    getProduct(id: string) {
        const item = new Item();
        item.id = id;
        const product = new Product(item);
        const indx = this.hasProduct(product);
        if (indx < 0) {
            return null;
        }
        return this.products[indx];
    }

    getProducts() {
        const localProducts = this.products;
        return localProducts.map((i) => i.getId());
    }

    cleanup() {
        this.products.map((product, i) => {
            if (product.getQuantity() < 1) {
                this.products.splice(i, 1);
            }
        });
    }
}
