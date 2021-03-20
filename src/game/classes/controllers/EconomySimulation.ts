import IPlayer from '../interfaces/IPlayer';
import ILocation from '../interfaces/ILocation';
import Item from '../qualifiedCollections/qualifiedItems/Item';
import Agent from '../Agent';
import Transaction from '../Transactions';
import Offers from '../qualifiedCollections/Offers';



//TODO: dialog mechanic and survival mechanic
export default class Economy {
    agents: Agent[] = [];
    availableItems: Item[] = []; //review
    self = this;
    // availableItems: Inventory = new Inventory();
    currentDay = 0;

    listAgentNames = [
        `Torela`,
        `Laguerta`,
        `Ganiva`,
        `Torpesia`,
        `Hellbary`
    ]

    promote: { //something to persist who has what so we don't have to loop through everytime
        [key: string]: Offers;
    } = {};

    transactions: Transaction[] = [];



    constructor() {
        this.createavAilableItems();
        this.createAgents();
    }

    step() {
        this.createNeeds();
        this.produce();
        this.trade();
    }

    createavAilableItems() {
        this.listAgentNames.map((name) => {
            const productName = `${name}bildung`
            const initItem = {
                name: productName
            }
            const product = new Item(initItem);
            this.availableItems.push(product);
        });
    }

    createAgents() {
        this.listAgentNames.map((name) => {
            const agentInit = {
                name
            };
            const agent = new Agent(agentInit);
            const money = Math.ceil(Math.random() * 10000)
            agent.wallet.setFunds(money);
            this.agents.push(agent);
        });
    }

    setCurrentDay(day: number) {
        this.currentDay = day;
    }

    produce() {
        this.agents.forEach((agent) =>
            agent.produce(this.availableItems));

    }

    createNeeds() {
        this.agents.forEach((agent) => agent.createNeeds(this.availableItems));
    }

    trade() {
        this.agents.forEach((agent) => {
            if (agent.hasOffers()) {
                this.promote[agent.id] = agent.offers;
            }
            if (!agent.hasNeeds()) {
                return;
            }
            const promotingAgents = Object.keys(this.promote);
            promotingAgents.splice(promotingAgents.indexOf(agent.id), 1);
            promotingAgents.forEach((promoter) => {
                const intersection = this.promote[promoter].getProducts().filter(value => agent.needs.getNeeds().includes(value));
                if (intersection.length) {
                    intersection.forEach((i) => {
                        const product = this.promote[promoter].getProduct(i);
                        const need = agent.needs.getNecessity(i);
                        if (need && product && need.getBid() >= product.getAsk() && product.getQuantity() >= need.getQuantity()) {
                            need.setBid(product.getAsk()); // No one is going to pay more than  they have to.
                            const seller = this.agents.find((a) => a.id == promoter);
                            if (seller) {
                                seller.sell(need);
                                agent.buy(product);
                                const transactionInit = {
                                    buyer: new Agent({... agent}),
                                    seller: new Agent({... seller}),
                                    item: new Item({... need.getItem()}),
                                    price: product.getAsk(),
                                    day: this.currentDay
                                }
                                const transaction = new Transaction(transactionInit);
                                this.transactions.push(transaction);
                                this.promote[seller.id] = seller.offers;
                            }
                        }
                    });
                }
            });
        });

    }
}
