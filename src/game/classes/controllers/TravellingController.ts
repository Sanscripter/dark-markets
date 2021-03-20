import ILocation from '../interfaces/ILocation';
import TimeController from './TimeController';
import World from '../World';

export default class TravellingController {

    constructor(world: World, timeController: TimeController){
        this.world = world;
        this.timeController = timeController;
    }

    private world: World;
    private timeController: TimeController;

    public activeLocation?: ILocation;
    public previousLocation?: ILocation;

    // public travel(destination:ILocation, callback: Function){
    //     this.previousLocation = this.activeLocation;
    //     this.timeController.dayPass(this.getTravelTime(destination));
    //     this.activeLocation = destination;
    //     callback();
    // }

    // public getTravelTime(destination:ILocation){
    //     return this.world.locations.find(
    //         (location:ILocation) => this.activeLocation?.name === location.name)
    //         ?.travelTimes[destination.name];
    // }
}