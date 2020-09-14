import IPlayer from '../interfaces/IPlayer';
import ILocation from '../interfaces/ILocation';
import TravellingController from './TravellingController';
import TimeController from './TimeController';
import World from './World';
import Economy from './EconomySimulation';
import GameService from '../services/GameService';


//TODO: dialog mechanic and survival mechanic
export default class Game {
    constructor(world:World, service: GameService, player?:IPlayer){
        this.player = player || null;
        this.world = world;
        this.service = service;
    }

    private player: IPlayer | null;
    private service: GameService;
    private world = new World();
    private economy = new Economy();

    
    public timeController = new TimeController();
    public travellingController = new TravellingController(this.world, this.timeController);

    //Game flow
   
    public turn(){
        this.checkEvents();
        this.economy.step();
        this.service.saveTransactions(this.economy.transactions);
    }

    public getTransactions(){
        return this.service.retrieveTransactions();
    }

    public getSimulationAgents(){
        return this.economy.agents;
    }
    
    // public travelTo(location: ILocation){
    //     this.travellingController.travel(location, this.turn);
    // }

    private checkEvents(){
        console.log('test check events');
    }
}