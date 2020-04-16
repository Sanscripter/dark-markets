import IPlayer from '../interfaces/IPlayer';
import ILocation from '../interfaces/ILocation';
import IWorld from '../interfaces/IWorld';


//TODO: dialog mechanic and survival mechanic
export default class Economy {
    agents: Agent[] = [];
    products: Inventory = new Inventory();
    wealthCap = 1000;

    listAgentNames = [
        `Torela`,
        `Laguerta`,
        `Ganiva`,
        `Torpesia`,
        `Hellbary`
    ]

    constructor() {
        this.createProducts();
        this.createAgents();
    }

    step() {
        this.produce();
        this.trade();
        console.table(this.agents);
    }

    createProducts() {
        this.listAgentNames.map((name) => {
            const productName = `${name}bildung`
            const porductPrice = Math.ceil(this.wealthCap / this.listAgentNames.length * Math.random());
            const productQty = Math.ceil(1000 * Math.random());
            const product = new Product(productName, porductPrice, productQty);
            this.products.add(product);
        });
    }

    createAgents() {
        this.listAgentNames.map((name) => {
            const agent = new Agent(name);
            agent.setWealth(this.wealthCap);
            this.agents.push(agent);
        });
    }

    produce() {
        this.agents.forEach((agent) => agent.determineProduce(this.products.items));
    }

    trade() {
        this.agents.forEach((agent) => {
            agent.determineNeed(this.products.items)
            if (!agent.need) {
                console.log(`${agent.name} has no needs at the time.`);
                return;
            }
            agent.buy(this.agents);
            if (agent.need.name) {
                agent.need.bid += 1;
                console.log(`${agent.name} bid for ${agent.need.name} just increased to ${agent.need.bid}`);
            }
        });

    }
}

class Agent {
    name: string;
    money: number = 0;
    need: ProductNeed = new ProductNeed(new Product());
    selling?: Product[];
    inventory: Inventory;

    constructor(name?: string) {
        this.name = name || ``;
        this.inventory = new Inventory();
    }

    buy(market: Agent[]) {
        console.log(`${this.name} is trying to buy ${this.need.name}...`);
        let productMatchIndex;
        const sellerMatchIndex = market.findIndex((seller) => {
            if (seller.name === this.name) {
                return;
            }
            let askReasonable;
            productMatchIndex = seller.inventory.hasItem(this.need);
            if (productMatchIndex >= 0) {
                askReasonable = seller.inventory.items[productMatchIndex].ask <= this.need.bid;
            }
            return productMatchIndex >= 0 && askReasonable;
        });
        if (productMatchIndex && sellerMatchIndex >= 0) {
            console.log(`${this.name} found a suitable seller of ${this.need.name} in ${market[sellerMatchIndex].name}...`);

            const acquiredProduct = market[sellerMatchIndex].inventory.items[productMatchIndex];
            this.money -= this.need.bid;
            this.inventory.add(acquiredProduct);
            market[sellerMatchIndex].sell(this.need);
            console.log(`${acquiredProduct.name} was bought by ${this.name} from ${market[sellerMatchIndex].name} for $${this.need.bid}`);
            this.need = new ProductNeed(new Product());
            return;
        } /// CHECK WHY ITEMS ARE COMING IN NEGATIVE QUANTITIES???
        console.log(`${this.name} found no suitable seller of ${this.need.name}.`);

    }

    sell(product: ProductNeed) {
        this.inventory.remove(product);
        this.money += product.bid;
    }

    determineProduce(productList?: Product[]) {
        if (!productList) {
            return null;
        }
        const randomizerLimit = productList.length;
        const indexOfProduct = Math.floor(Math.random() * randomizerLimit);
        const product = productList[indexOfProduct];
        product.quantity = 10;
        this.inventory.add(product);
        console.log(this.need)
        console.log(`${this.name} produced ${product.quantity} ${product.name}`);
        if (product.name === this.need.name && product.quantity >= this.need.quantity) {
            this.need = new ProductNeed(new Product());
            console.log(`${this.name} production of ${product.name} was enough to supply its need!`);

        }
    }

    determineNeed(productList: Product[]) {
        const randomizerLimit = productList.length;
        let indexOfProduct = Math.floor(Math.random() * randomizerLimit);
        while (this.inventory.hasItem(productList[indexOfProduct]) < 0) {
            indexOfProduct = Math.floor(Math.random() * randomizerLimit);
        }
        this.need = new ProductNeed(productList[indexOfProduct]);
        this.need.bid = this.need.determineBid(this.money - 1);
        console.log(`${this.name} now needs ${this.need.name}`)
        return this.need;
    }

    setWealth(wealthCap: number) {
        this.money = Math.ceil(Math.random() * wealthCap);
        console.log(`${this.name} spawns with $${this.money}`)
    }


}

class Product {
    name: string;
    ask: number;
    quantity: number;
    constructor(name?: string, ask?: number, quantity?: number) {
        this.name = name || ``;
        this.ask = ask || 0;
        this.quantity = quantity || 0;
    }
}

class ProductNeed {
    name: string;
    bid: number;
    quantity: number;
    constructor(product: Product) {
        this.name = product.name;
        this.quantity = this.determineQuantity();
        this.bid = this.determineBid();
    }

    determineQuantity() {
        return Math.ceil(Math.random() * 100) + 1;
    }

    determineBid(modifier: number = 0) {
        return Math.ceil(Math.random() * modifier) + 1;
    }
}

class Inventory {
    items: Product[] = [];

    add(product: Product) {
        console.log(`adding product`, product)
        const existingIndex = this.hasItem(product);
        if (existingIndex >= 0) {
            this.items[existingIndex].quantity += product.quantity;
            return;
        }
        this.items.push(product);
    }

    remove(product: Product | ProductNeed) {
        const existingIndex = this.hasItem(product);
        if (existingIndex <= 0) {
            console.log(`Somehow, tried to remove a ${product.name} that was not in an inventory.`);
            return;
        }

        this.items[existingIndex].quantity -= product.quantity;
        const difference = this.items[existingIndex].quantity;

        this.cleanup();

        return 0 - difference;
    }

    hasItem(product: Product | ProductNeed) {
        return this.items.findIndex((item: Product) => item.name === product.name);
    }

    cleanup() {
        this.items = this.items.filter((item) => item.quantity > 0);
    }
}