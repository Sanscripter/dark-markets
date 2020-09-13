import IPlayer from '../interfaces/IPlayer';
import ILocation from '../interfaces/ILocation';
import TravellingController from './TravellingController';
import TimeController from './TimeController';
import World from './World';


//TODO: dialog mechanic and survival mechanic
export default class Game {
    constructor(player:IPlayer, world:World){
        this.player = player;
        this.world = world;
    }

    private player: IPlayer;
    private world = new World();
    
    public timeController = new TimeController();
    public travellingController = new TravellingController(this.world, this.timeController);

    //Game flow
   
    public turn(){
        this.checkEvents();
    }
    
    public travelTo(location: ILocation){
        this.travellingController.travel(location, this.turn);
    }

    private checkEvents(){
        console.log('test check events');
    }
}