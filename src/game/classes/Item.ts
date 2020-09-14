//@ts-ignore
import UniqueElement from './UniqueElement';


export default class Item extends UniqueElement {

    public name: string;
    private quantity: number = 0;
    
    constructor(name: string = '') {
        super(name);
        this.name = name;
    }
    
    setQuantity(quantity: number) {
        if (quantity < 0) {
            this.quantity = 0;
            return;
        }
        this.quantity = quantity
    }

    getQuantity() {
        return this.quantity;
    }
}