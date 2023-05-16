import {EventEmitter} from "events"


    export type threeenum = 0 | 1 | 2

export class varlistener<T>{
    #listener: EventEmitter;
    value: T;
    constructor(basevalue: T){
        this.#listener = new EventEmitter()
        this.value = basevalue;
    }
    set(newvalue: T){
        this.#listener.emit("change", this.value, newvalue)
        this.value = newvalue
    }
    get(){
        return this.value;
    }
    addListener(listenerfunction: (value: T, newvalue: T) => any){
        this.#listener.addListener("change", listenerfunction)
    }
}
