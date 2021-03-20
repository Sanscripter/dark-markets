import Agent from './Agent';
import Item from './qualifiedCollections/qualifiedItems/Item';
import UniqueElement from './UniqueElement';

export default class Transaction extends UniqueElement{
    constructor(init?: Partial<Transaction>) {
        super(`${init?.buyer}-${init?.seller}I${init?.item?.name}$${init?.price}T${init?.day}`)
        Object.assign(this, init);
    }
    
    buyer = new Agent({});
    seller = new Agent({});
    item = new Item();
    price = 0;
    day = 0;

    log(){
        console.log(`${this.buyer.name} has bought ${this.item.name} from ${this.seller.name} for ${this.price}`)
    }
}