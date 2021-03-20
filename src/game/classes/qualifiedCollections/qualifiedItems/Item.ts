import UniqueElement from '../../UniqueElement';


export default class Item extends UniqueElement {

    public name = '';
    private quantity = 0;
    
    constructor(init?: Partial<Item>) {
        super(init?.name || '');
        Object.assign(this, init);
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