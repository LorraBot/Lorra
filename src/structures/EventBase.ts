import Lorra from "../client/client";

export default abstract class EventBase {
    private _eventName: string;

    constructor(name: string) {
        this._eventName = name;
    }

    get eventName(): string { return this._eventName; }

    abstract execute(client: Lorra, ...args: any): void;
}