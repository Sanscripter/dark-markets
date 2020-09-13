import Item from './Item';

export default class Necessity {
    item: Item;
    needScore: number = 1; //Assuming I'll need this *ACHILLES HEELL*
    bid: number = 0;

    constructor(item: Item, quantityNeeded?: number) {
        this.item = item;

        if (quantityNeeded) {
            this.item.setQuantity(quantityNeeded);
        } else {
            this.item.setQuantity(1);
        }
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

    setNeedScore(needScore: number) {
        if (needScore < 1) {
            return;
        }
        this.needScore = needScore;
    }

    getNeedScore() {
        return this.needScore;
    }

    setQuantity(quantity: number) {
        this.item.setQuantity(quantity);
    }

    getQuantity() {
        return this.item.getQuantity();
    }

    setBid(bid: number) {
        if (bid < 0) {
            this.bid = 0;
            return;
        }
        this.bid = bid;
    }

    getBid() {
        return this.bid;
    }

}