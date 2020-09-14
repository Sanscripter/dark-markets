import Inventory from './Inventory';
import Item from './Item';
import Necessity from './Necessity';
import Needs from './Needs';
import Offers from './Offers';
import Product from './Product';
import UniqueElement from './UniqueElement';
import Wallet from './Wallet';

export default class Agent extends UniqueElement {
    name: string;
    wallet: Wallet = new Wallet();
    inventory: Inventory = new Inventory();
    offers: Offers = new Offers();
    needs: Needs = new Needs();

    constructor(name: string) {
        super(name);
        this.name = name;
    }

    resourceCurve(item: Item){
        return item.getQuantity() < 2; //for items this agent posses, a need will only arise when there is less than 2 items (mock, ideally different resources would have different levels of necessities for different agents)
    }

    createNeeds(needPossibilities: Item[]) { //doublecheck
        let resourcesDemanded = needPossibilities.filter((item) => {
            if(this.inventory.getItem(item.id)){
                return this.resourceCurve(this.inventory.getItem(item.id))
            }
            return true;
        });
        if(!resourcesDemanded.length) {
            return;
        }
        let baseItem = resourcesDemanded[Math.floor(resourcesDemanded.length * Math.random())]; /// will ask just one of the needed items at a time
        const newNeed = new Necessity(baseItem);
        newNeed.setBid(Math.ceil(Math.random() * 100) + 1); //doublecheck
        newNeed.setQuantity(5) // doublecheck
        this.needs.add(newNeed);
    }

    produce(productionPosibilities: Item[], callback?: Function) {
        const productionResult = productionPosibilities[Math.floor(productionPosibilities.length * Math.random())]; //doublecheck
        const gennedNumber = Math.ceil(Math.random() * 100) + 1;
        productionResult.setQuantity(gennedNumber);
        console.log('City', this.name);
        console.log('Produced', gennedNumber , productionResult);
        console.log(`${productionResult.name} - qty ${productionResult.getQuantity()}`)        
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