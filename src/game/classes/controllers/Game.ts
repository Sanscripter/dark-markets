import IPlayer from '../interfaces/IPlayer';
import TravellingController from '@/game/classes/controllers/TravellingController';
import TimeController from '@/game/classes/controllers/TimeController';
import World from '@/game/classes/World';
import Economy from '@/game/classes/controllers/EconomySimulation';
import GameService from '@/game/classes/services/GameService';


//TODO: dialog mechanic and survival mechanic
export default class Game {
    constructor(world: World, service: GameService, player?: IPlayer) {
        this.player = player || null;
        this.world = world;
        this.service = service;
    }

    private player: IPlayer | null;
    private service: GameService;
    public world = new World();
    private economy = new Economy();


    public timeController = new TimeController();
    public travellingController = new TravellingController(this.world, this.timeController);

    //Game flow

    public turn() {
        this.economy.setCurrentDay(this.timeController.getCurrentDay());
        this.checkEvents();
        this.economy.step();
        this.timeController.dayPass();
        this.save();
    }

    private save() {
        this.service.saveTransactions(this.economy.transactions);
        this.service.saveDate(this.timeController.getCurrentDay());
    }

    public getTransactions() {
        return this.service.retrieveTransactions();
    }

    public getSimulationAgents() {
        return this.economy.agents;
    }

    // public travelTo(location: ILocation){
    //     this.travellingController.travel(location, this.turn);
    // }

    private checkEvents() {
        console.log('test check events');
    }
}