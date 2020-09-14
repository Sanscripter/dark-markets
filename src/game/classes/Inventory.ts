import Item from "./Item";

export default class Inventory {
    items: {
        [key: string]: Item
    } = {};

    add(item: Item) {
        console.log(`Adding item ${item.getQuantity()} - ${item.name} to  inventory`, item)
        if (!this.hasItem(item)) {
            console.log(`new item!`)

            this.items[item.id] = item;
            console.log(`item in inventory ${this.items[item.id].getQuantity()} ${this.items[item.id].name}`, this.items[item.id])
            return this.items[item.id];
        }

        console.log(`Existing item, just new units.`)
        console.log(`Current amount: ${this.items[item.id].getQuantity()}`)
        //@ts-ignore
        const newQty = this.items[item.id].getQuantity() + item.getQuantity();
        console.log(`New item quantity ${newQty}`)
        this.items[item.id].setQuantity(newQty);
        console.log(`Check New item quantity ${this.items[item.id].getQuantity()}`)
        this.cleanup();
        return this.items[item.id];
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
        if(!item) {
            console.log('undefined or null item', item)
            return item;
        }
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