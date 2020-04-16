import IPlayer from '../interfaces/IPlayer';
import ILocation from '../interfaces/ILocation';
import IWorld from '../interfaces/IWorld';


//TODO: dialog mechanic and survival mechanic
export default class Game {
    constructor(player:IPlayer, world:IWorld){
        this.player = player;
        this.world = world;
    }

    private player: IPlayer;
    private world: IWorld;

    public daysCounter = 0;
    public activeLocation?: ILocation;
    public previousLocation?: ILocation;

    //Game flow
   


    //Travel
    public travel(destination:ILocation){
        this.previousLocation = this.activeLocation;
        this.daysCounter += this.getTravelTime(destination);
        this.activeLocation = destination;
        this.checkEvents();
    }

    public getTravelTime(destination:ILocation){
        return this.world.locations.find((location:ILocation) => this.activeLocation?.name === location.name)?.travelTimes[destination.name];
    }

    private checkEvents(){
        console.log('test check events');
    }
}