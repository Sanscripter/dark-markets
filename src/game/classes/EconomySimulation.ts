import IPlayer from '../interfaces/IPlayer';
import ILocation from '../interfaces/ILocation';
import IWorld from '../interfaces/IWorld';
//@ts-ignore
import * as Hashes from 'jshashes';

const MD5 = new Hashes.MD5

//TODO: dialog mechanic and survival mechanic
export default class Economy {
    agents: Agent[] = [];  //review
    availableItems: Item[] = [];
    self = this;
    // availableItems: Inventory = new Inventory();


    listAgentNames = [
        `Torela`,
        `Laguerta`,
        `Ganiva`,
        `Torpesia`,
        `Hellbary`
    ]

    promote: { //something to persist who has what so we don't have to loop through everytime
        [key: string]: string[]
    } = {};



    constructor() {
        this.createavAilableItems();
        this.createAgents();
    }

    step() {
        this.produce();
        this.trade();
        console.table(this.agents);
    }

    updatePromote(self: Economy) {
        return (agent: Agent) => {
            if (!self.promote[agent.id]) {
                self.promote[agent.id] = [];
            }
            const itemsInPosession = Object.keys(agent.inventory.items);
            self.promote[agent.id] = itemsInPosession;
        }
    }

    createavAilableItems() {
        this.listAgentNames.map((name) => {
            const productName = `${name}bildung`
            const product = new Item(productName);
            this.availableItems.push(product);
        });
    }

    createAgents() {
        this.listAgentNames.map((name) => {
            let agent = new Agent(name);
            let money = Math.ceil(Math.random() * 10000)
            agent.wallet.setFunds(money);
            this.agents.push(agent);
        });
    }

    produce() {
        this.agents.forEach((agent) => agent.produce(this.availableItems, this.updatePromote(this)));
    }

    createNeeds() {
        this.agents.forEach((agent) => agent.createNeeds(this.availableItems));
    }

    trade() {
        this.agents.forEach((agent) => {
            agent.createNeeds(this.availableItems);
            let needsIds = Object.keys(agent.needs.items); // how can we prioritize needs?
            let promotingAgents = Object.keys(this.promote);
            promotingAgents.forEach((promoting) => {
                if (promoting === agent.id) {
                    return;
                }
                let canSupply = needsIds.filter(need => (this.promote[promoting].includes(need)));
                if (!canSupply.length) {
                    return;
                }
                let matchSellerIndex = this.agents.findIndex(match => match.id === promoting);

                canSupply.forEach((suppliable) => {
                    let demand = agent.needs.getNecessity(suppliable);
                    let supply = this.agents[matchSellerIndex].offers.getProduct(suppliable);
                    if (!demand || !supply || demand.getBid() < supply.getAsk()) {
                        return;
                    }
                    supply.setAsk(demand.getBid());
                    agent.buy(supply, this.updatePromote(this)) // read above.
                    this.agents[matchSellerIndex].sell(demand, this.updatePromote(this));
                    console.log(`${agent.name} has bought ${supply.getName()} from ${this.agents[matchSellerIndex].name} for ${demand.getBid()}`)
                });
            });
        });

    }
}

class Agent {
    id: string;
    name: string;
    wallet: Wallet = new Wallet();
    inventory: Inventory = new Inventory();
    offers: Offers = new Offers();
    needs: Needs = new Needs();

    constructor(name: string) {
        this.name = name;
        this.id = MD5.hex(name);
    }

    createNeeds(needPossibilities: Item[]) { //doublecheck
        let baseItem = needPossibilities[Math.floor(needPossibilities.length * Math.random())];
        // while(this.inventory.hasItem(baseItem)){
        //     baseItem = needPossibilities[Math.floor(needPossibilities.length * Math.random())];
        // }
        const newNeed = new Necessity(baseItem);
        newNeed.setBid(Math.ceil(Math.random() * 100) + 1); //doublecheck
        newNeed.setQuantity(5) // doublecheck
        this.needs.add(newNeed);
    }

    produce(productionPosibilities: Item[], callback?: Function) {
        const productionResult = productionPosibilities[Math.floor(productionPosibilities.length * Math.random())]; //doublecheck
        const gennedNumber = Math.ceil(Math.random() * 100) + 1;
        productionResult.setQuantity(gennedNumber);
        console.log('Produced', productionResult);
        console.log(`genned number`, gennedNumber)
        this.inventory.add(productionResult);
        this.syncNeeds();
        this.syncOffers();
        if (!callback) {
            return;
        }
        callback(this);
    }

    buy(product: Product, callback?: Function) {
        this.updateWallet(- product.getAsk());
        this.addInventory(product.getItem(), callback);
        this.syncNeeds();
        this.syncOffers();
    }

    sell(necessity: Necessity, callback?: Function) {
        this.removeInventory(necessity.getItem(), callback);
        this.syncOffers();
        this.updateWallet(necessity.getBid());
    }

    addInventory(item: Item, callback?: Function) {
        this.inventory.add(item);
        if (!callback) {
            return;
        }
        callback(this);
    }

    removeInventory(item: Item, callback?: Function) {
        this.inventory.remove(item);
        if (!callback) {
            return;
        }
        callback(this);
    }

    updateWallet(amount: number) {
        const newFunds = this.wallet.getFunds() + amount;
        this.wallet.setFunds(newFunds);
    }

    syncNeeds() { //doublecheck
        console.log(`Syncing needs`)
        const inventoryIds = Object.keys(this.inventory.items);
        const needsIds = Object.keys(this.needs.items);
        const diffRemove = needsIds.filter(item => inventoryIds.includes(item));
        if (!diffRemove.length) {
            return;
        }
        diffRemove.map((diffItem) => {
            let item = this.inventory.getItem(diffItem);
            if (!item) {
                return;
            }

            let necessity = this.needs.hasNecessity(new Necessity(item));
            if (!necessity) {
                return;
            }

            if (necessity.getQuantity() > item.getQuantity()) {
                necessity.setQuantity(item.getQuantity());
            }
            console.log(`Removing necessity`,necessity);
            this.needs.remove(necessity);
        })
    }

    syncOffers() { // doublecheck
        const inventoryIds = Object.keys(this.inventory.items);
        const offersIds = Object.keys(this.offers.products);
        const diffAdd = inventoryIds.filter(item => !offersIds.includes(item));
        if (!diffAdd.length) {
            return;
        }
        diffAdd.map((diffItem) => {
            let item = this.inventory.getItem(diffItem);
            if (!item) {
                return;
            }
            let product = new Product(item);

            product.setAsk(this.determineProductAsk(product) + 30); //doublecheck
            this.offers.add(product);
        })

        const diffRemove = offersIds.filter(item => !inventoryIds.includes(item));
        if (!diffRemove.length) {
            return;
        }
        diffRemove.map((diffItem) => {
            let product = this.offers.getProduct(diffItem);
            if (!product) {
                return;
            }
            this.offers.remove(product);
        })
    }

    determineProductAsk(product: Product) {
        return product.getQuantity() * Math.ceil(Math.random() * 10); // doublecheck
    }

    determineNecessityBid(necessity: Necessity) {
        return necessity.getQuantity() * Math.ceil(Math.random() * 1000); // doublecheck
    }

    determineNecessityScore(necessity: Necessity) {
        return Math.ceil(1000 * Math.random()); //doublecheck
    }

    determineNecessityQuantity(necessity: Necessity) {
        return Math.ceil(necessity.getNeedScore() * Math.random()); //doublecheck
    }
}

class Wallet {
    private funds: number = 0;

    setFunds(newFunds: number) {
        this.funds = newFunds;
    }

    getFunds() {
        return this.funds;
    }
}

class Needs {
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

class Necessity {
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

class Offers {
    products: {
        [key: string]: Product
    } = {};

    constructor() { }

    add(product: Product) {
        //If we have to create a new product, we'll return it whole, if it's just stackign quantities, we'll return the qty
        if (!this.hasProduct(product)) {
            this.products[product.getId()] = product;
            return this.products[product.getId()];
        }
        //@ts-ignore
        const newQty = this.products[product.getId()].getQuantity() + product.getQuantity();
        this.products[product.getId()].setQuantity(newQty);
        return this.products[product.getId()].getQuantity();
    }

    remove(product: Product) {
        //If there is no item, there's nothing to return, otherwise, return qty (even if it is negative??)
        const stockedProduct = this.hasProduct(product)
        if (!stockedProduct) {
            return null;
        }

        const newQty = this.products[product.getId()].getQuantity() - product.getQuantity();
        this.products[product.getId()].setQuantity(newQty);

        if (!this.products[product.getId()].getQuantity()) {
            delete this.products[product.getId()];
        }

        return newQty;
    }

    hasProduct(product: Product) {
        return this.products[product.getId()];
    }

    getProduct(id: string) {
        const item = new Item();
        item.id = id;
        const product = new Product(item);
        return this.hasProduct(product);
    }

}

class Product {
    private item: Item;
    private ask: number = 0;
    constructor(item: Item) {
        this.item = item;
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

    setQuantity(quantity: number) {
        this.item.setQuantity(quantity);
    }

    getQuantity() {
        return this.item.getQuantity();
    }

    setAsk(ask: number) {
        if (ask < 0) {
            this.ask = 0;
            return;
        }
        this.ask = ask;
    }

    getAsk() {
        return this.ask;
    }
}

class Inventory {
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

class Item {
    id: string;
    name: string;
    private quantity: number = 0;

    constructor(name: string = '') {
        this.name = name;
        this.id = MD5.hex(name);
    }

    setQuantity(quantity: number) {
        console.log(`Qty`,quantity)
        console.log(`Comparison`,100 < 0)
        if (100 < 0) {
            this.quantity = 0;
            return;
        }
        this.quantity = quantity
    }

    getQuantity() {
        return this.quantity;
    }
}
