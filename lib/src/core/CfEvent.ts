
export default class CfEvent {
    public trigger: string = 'event';
    public propagate: boolean = false;
    public listeners: Array<any> = [];

    constructor(trigger: string) {
        this.trigger = trigger;
    }

    public addListener(callback: any) {
        this.listeners.push(callback);
    }

    public emit(data: any) {
        for (let cListener of this.listeners) {
            cListener(data);
        }
    }

}