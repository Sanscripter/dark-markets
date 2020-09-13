import Agent from './Agent';
import Item from './Item';

export default class Transaction {
    constructor(buyer: Agent, seller: Agent, item: Item, price:number, day: number){
        this.buyer = buyer;
        this.seller = seller;
        this.item = item;
        this.price = price;
        this.day = day;
    }
    
    buyer: Agent;
    seller: Agent;
    item: Item;
    price: number;
    day: number;
}