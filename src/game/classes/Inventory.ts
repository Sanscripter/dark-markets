import Item from "./Item";

export default class Inventory {
    items: {
        [key: string]: Item
    } = {};

    add(item: Item) {
        //If we have to create a new item, we'll return it whole, if it's just stackign quantities, we'll return the qty
        if (!this.hasItem(item)) {
            this.items[item.id] = item;
            return this.items[item.id];
        }
        //@ts-ignore
        const newQty = this.items[item.id].getQuantity() + item.getQuantity();
        this.items[item.id].setQuantity(newQty);
        this.cleanup();
        return this.items[item.id].getQuantity();
    }

    remove(item: Item) {
        //If there is no item, there's nothing to return, otherwise, return qty (even if it is negative??)
        const storedItem = this.hasItem(item)
        if (!storedItem) {
            return null;
        }

        const newQty = this.items[item.id].getQuantity() - item.getQuantity();
        this.items[item.id].setQuantity(newQty);

        if (!this.items[item.id].getQuantity()) {
            delete this.items[item.id];
        }

        this.cleanup();
        return newQty;
    }

    hasItem(item: Item) {
        return this.items[item.id];
    }

    getItem(id: string) {
        const item = new Item();
        item.id = id;
        return this.hasItem(item);
    }

    cleanup(){
        const idList = Object.keys(this.items);
        idList.forEach((id)=>{
            let item = this.getItem(id);
            if(item && item.getQuantity()){
                return;
            }
            this.remove(item);
        })
    }
}