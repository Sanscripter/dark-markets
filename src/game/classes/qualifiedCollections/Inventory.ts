import Item from "./qualifiedItems/Item";

export default class Inventory {
    items: Item[] = [];

    add(item: Item) {
        if (item.getQuantity() < 1) {
            return; //don't add 0 quantity items
        }

        const indx = this.hasItem(item);
        if (indx < 0) {
            this.items.push(item);
            return this.items[this.items.length - 1];
        }

        const newQty = this.items[indx].getQuantity() + item.getQuantity();
        this.items[indx].setQuantity(newQty);
        return this.items[indx];
    }

    remove(item: Item) {
        if (item.getQuantity() < 1) {
            return; //don't remove 0 quantity items
        }

        const indx = this.hasItem(item);
        if (indx < 0) {
            return;
        }

        const newQty = this.items[indx].getQuantity() - item.getQuantity();
        if (newQty < 1) {
            this.items.splice(indx, 1);
            return;
        }

        this.items[indx].setQuantity(newQty);
        return newQty;
    }

    hasItem(item: Item) {
        return this.items.findIndex((i) => i.id == item.id);
    }

    getItem(id: string) {
        const item = new Item();
        item.id = id;
        const indx = this.hasItem(item);
        if (indx < 0) {
            return null;
        }
        return this.items[indx];
    }

    getPossessions() {
        const localItems = this.items;
        return localItems.map((i) => i.id);
    }

    cleanup() {
        this.items.map((item, i) => {
            if (item.getQuantity() < 1) {
                this.items.splice(i, 1);
            }
        });
    }
}