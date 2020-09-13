export default class TimeController {
    private currentDay = 0;

    public dayPass(days=1){
        this.currentDay += days;
        return this.currentDay;
    }

    public getCurrentDay() {
        return this.currentDay;
    }
   
    public setCurrentDay(day: number) {
        this.currentDay = day;
    }
}