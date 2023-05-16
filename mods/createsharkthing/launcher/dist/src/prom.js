"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deasync_1 = __importDefault(require("deasync"));
function promise() {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 2000);
    });
}
function wrapper() {
    let done = false;
    promise().then(x => {
        done = true;
    });
    while (!done) {
        deasync_1.default.sleep(100);
    }
}
console.log("Starting");
wrapper();
console.log("Done");
