import Item from './qualifiedItems/Item';
import Necessity from './qualifiedItems/Necessity';

export default class Needs {
    necessities: Necessity[] = [];

    add(necessity: Necessity) {
        const indx = this.hasNecessity(necessity);
        if (indx < 0) {
            this.necessities.push(necessity);
            return this.necessities[this.necessities.length - 1];
        }

        const newQty = this.necessities[indx].getQuantity() + necessity.getItem().getQuantity();
        this.necessities[indx].setQuantity(newQty);
        return this.necessities[indx];
    }

    remove(necessity: Necessity) {
        const indx = this.hasNecessity(necessity);
        if (indx < 0) {
            return;
        }
        const newQty = this.necessities[indx].getQuantity() - necessity.getItem().getQuantity();
        if (newQty < 1) {
            this.necessities.splice(indx, 1);
            return;
        }
        this.necessities[indx].setQuantity(newQty);
        return newQty;
    }

    getNeeds() {
        const localNecessities = this.necessities;
        return localNecessities.map((i) => i.item.id);
    }

    cleanup() {
        this.necessities.map((item, i) => {
            if (item.getQuantity() < 1) {
                this.necessities.splice(i, 1);
            }
        });
    }

    hasNecessity(necessity: Necessity) {
        return this.necessities.findIndex((n) => n.getId() == necessity.getId());
    }

    getNecessity(id: string) {
        const item = new Item();
        item.id = id;
        const necessity = new Necessity(item);
        const indx = this.hasNecessity(necessity);
        if (indx < 0) {
            return;
        }
        return this.necessities[indx];
    }
}