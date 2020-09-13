import IPlayer from '../interfaces/IPlayer';
import ILocation from '../interfaces/ILocation';
import Item from './Item';
import Agent from './Agent';



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

    transactions = [];



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
