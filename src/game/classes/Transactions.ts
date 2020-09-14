import Agent from './Agent';
import Item from './Item';
import UniqueElement from './UniqueElement';

export default class Transaction extends UniqueElement{
    constructor(buyer: Agent, seller: Agent, item: Item, price:number, day?: number){
        super(`${buyer}-${seller}I${item.name}$${price}T${new Date().toISOString()}`)
        this.buyer = buyer;
        this.seller = seller;
        this.item = item;
        this.price = price;
    }
    
    buyer: Agent;
    seller: Agent;
    item: Item;
    price: number;
    day: number = 0;

    log(){
        console.log(`${this.buyer.name} has bought ${this.item.name} from ${this.seller.name} for ${this.price}`)
    }
}