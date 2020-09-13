import Item from './Item';

export default class Product {
    private item: Item;
    private ask: number = 0;
    constructor(item: Item) {
        this.item = item;
    }

    getId() {
        return this.item.id;
    }

    getName() {
        return this.item.name;
    }

    getItem() {
        return this.item;
    }

    setQuantity(quantity: number) {
        this.item.setQuantity(quantity);
    }

    getQuantity() {
        return this.item.getQuantity();
    }

    setAsk(ask: number) {
        if (ask < 0) {
            this.ask = 0;
            return;
        }
        this.ask = ask;
    }

    getAsk() {
        return this.ask;
    }
}