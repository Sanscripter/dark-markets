import Item from './Item';
import Necessity from './Necessity';

export default class Needs {
    items: {
        [key: string]: Necessity
    } = {};

    add(necessity: Necessity) {
        //If we have to create a new Necessity, we'll return it whole, if it's just stackign quantities, we'll return the qty
        if (!this.hasNecessity(necessity)) {
            this.items[necessity.getId()] = necessity;
            return this.items[necessity.getId()];
        }
        //@ts-ignore
        const newQty = this.items[necessity.getId()].getQuantity() + necessity.getQuantity();
        this.items[necessity.getId()].setQuantity(newQty);
        this.cleanup();
        return this.items[necessity.getId()].getQuantity();
    }

    remove(necessity: Necessity) {
        //If there is no Necessity, there's nothing to return, otherwise, return qty (even if it is negative??)
        const currentNecessity = this.hasNecessity(necessity);
        console.log(`current necessity`, currentNecessity);
        if (!currentNecessity) {
            return null;
        }

        const newQty = this.items[necessity.getId()].getQuantity() - necessity.getQuantity();
        this.items[necessity.getId()].setQuantity(newQty);
        console.log(`necessity new quantity`,this.items[necessity.getId()])

        if (!this.items[necessity.getId()].getQuantity()) {
            delete this.items[necessity.getId()];
        }
        this.cleanup();
        return newQty;
    }

    hasNecessity(necessity: Necessity) {
        return this.items[necessity.getId()];
    }

    getNecessity(id: string) {
        const item = new Item();
        item.id = id;
        const necessity = new Necessity(item);
        return this.hasNecessity(necessity);
    }

    cleanup(){
        const idList = Object.keys(this.items);
        idList.forEach((id)=>{
            let item = this.getNecessity(id);
            if(item && item.getQuantity()){
                return;
            }
            this.remove(item);
        })
    }
}