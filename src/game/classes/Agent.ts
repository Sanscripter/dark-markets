import Inventory from './qualifiedCollections/Inventory';
import Item from './qualifiedCollections/qualifiedItems/Item';
import Necessity from './qualifiedCollections/qualifiedItems/Necessity';
import Needs from './qualifiedCollections/Needs';
import Offers from './qualifiedCollections/Offers';
import Product from './qualifiedCollections/qualifiedItems/Product';
import UniqueElement from './UniqueElement';
import Wallet from './Wallet';

export default class Agent extends UniqueElement {
 
    name = '';
    wallet: Wallet = new Wallet();
    inventory: Inventory = new Inventory();
    offers: Offers = new Offers();
    needs: Needs = new Needs();

    constructor(init?: Partial<Agent>) {
        super(init?.name || '');
        Object.assign(this, init);
    }

    resourceCurve(item: Item) {
        return item.getQuantity() < 2; //for items this agent posses, a need will only arise when there is less than 2 items (mock, ideally different resources would have different levels of necessities for different agents)
    }

    createNeeds(needPossibilities: Item[]) { //doublecheck
        const resourcesDemanded = needPossibilities.filter((item) => {
            const resource = this.inventory.getItem(item.id)
            if (resource) {
                return this.resourceCurve(resource);
            }
            return true;
        });
        if (!resourcesDemanded.length) {
            return;
        }
        const baseItem = resourcesDemanded[Math.floor(resourcesDemanded.length * Math.random())]; /// will ask just one of the needed items at a time
        const initItem = {... baseItem};
        const newNeed = new Necessity(new Item(initItem));
        newNeed.setNeedScore(this.determineNeedScore());
        newNeed.setBid(this.determineNecessityBid(newNeed));
        newNeed.setQuantity(this.determineNecessityQuantity(newNeed));
        this.needs.add(newNeed);
    }

    produce(productionPosibilities: Item[]) {
        const productionResult = productionPosibilities[Math.floor(productionPosibilities.length * Math.random())]; //doublecheck
        const gennedNumber = Math.ceil(Math.random() * 100) + 1;
        if (gennedNumber > 0) {
            const item = new Item({... productionResult}); 
            item.setQuantity(gennedNumber);
            this.inventory.add(item);
            this.syncNeeds();
            this.syncOffers();
        }
    }

    buy(product: Product, callback?: Function) {
        this.updateWallet(- product.getAsk());
        this.addInventory(product.getItem(), callback);
        this.syncNeeds();
        this.syncOffers();
    }

    sell(necessity: Necessity, callback?: Function) {
        this.removeInventory(necessity.getItem(), callback);
        this.syncNeeds();
        this.syncOffers();
        this.updateWallet(necessity.getBid());
    }

    addInventory(item: Item, callback?: Function) {
        if (item.getQuantity() > 0) {
            this.inventory.add(item);
        }
        if (!callback) {
            return;
        }
        callback(this);
    }

    removeInventory(item: Item, callback?: Function) {
        this.inventory.remove(item);
        this.inventory.cleanup();
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
        const inventoryIds = this.inventory.getPossessions();
        const needsIds = this.needs.getNeeds();
        const diffRemove = needsIds.filter(need => !inventoryIds.includes(need));
        if (!diffRemove.length) {
            return;
        }

        diffRemove.map((diffItem) => {
            const item = this.inventory.getItem(diffItem);
            if (!item) {
                return;
            }

            const indx = this.needs.hasNecessity(new Necessity(new Item({... item})));
            if (indx < 0) {
                return;
            }
            const necessity = this.needs.getNecessity(item.id);
            if (necessity && necessity.getQuantity() > item.getQuantity()) {
                necessity.setQuantity(necessity.getQuantity() - item.getQuantity());
            }
            this.needs.cleanup();
        })
    }

    syncOffers() { // doublecheck
        const inventoryIds = this.inventory.getPossessions();
        const offersIds = this.offers.getProducts();
        const diffAdd = inventoryIds.filter(item => !offersIds.includes(item));
        if (!diffAdd.length) {
            return;
        }
        diffAdd.map((diffItem) => {
            const item = this.inventory.getItem(diffItem);
            if (!item) {
                return;
            }
            const product = new Product(new Item({... item}));
            product.setAsk(this.determineProductAsk(product) + 30); //doublecheck
            this.offers.add(product);
        })

        const diffRemove = offersIds.filter(item => !inventoryIds.includes(item));
        if (!diffRemove.length) {
            return;
        }
        diffRemove.map((diffItem) => {
            const product = this.offers.getProduct(diffItem);
            if (!product) {
                return;
            }
            this.offers.remove(product);
        })
    }

    hasOffers() {
       return this.offers.products;
    }

    hasNeeds() {
       return this.needs.necessities;
    }

    determineProductAsk(product: Product) {
        return product.getQuantity() * Math.ceil(Math.random() * 10); // doublecheck
    }

    determineNecessityBid(necessity: Necessity) {
        return necessity.getQuantity() * Math.ceil(Math.random() * 1000000); // doublecheck
    }

    determineNeedScore() {
        return Math.ceil(100 * Math.random()); //should be a function of the nodes consumption profile
    }

    determineNecessityQuantity(necessity: Necessity) {
        return Math.ceil(necessity.getNeedScore() * Math.random() * 5); //doublecheck
    }
}