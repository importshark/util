"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.varlistener = void 0;
const events_1 = require("events");
class varlistener {
    #listener;
    value;
    constructor(basevalue) {
        this.#listener = new events_1.EventEmitter();
        this.value = basevalue;
    }
    set(newvalue) {
        this.#listener.emit("change", this.value, newvalue);
        this.value = newvalue;
    }
    get() {
        return this.value;
    }
    addListener(listenerfunction) {
        this.#listener.addListener("change", listenerfunction);
    }
}
exports.varlistener = varlistener;
