"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loader_1 = require("./loader");
const loaderdata_json_1 = require("../loaderdata.json");
const timer_node_1 = require("timer-node");
const timer = new timer_node_1.Timer();
let progress = 0;
let prog;
let numeratorA = 1;
let numeratorB = 1;
let denominatorA = loaderdata_json_1.averages[1].total;
let denominatorB = 0;
let i = 0;
timer.start();
let done = false;
let int = setInterval(() => {
    let time = timer.ms();
    denominatorB = time;
    let multipleA = denominatorA;
    let multipleB = denominatorB * numeratorA;
    let answer = multipleB / denominatorA;
    prog = Number(answer.toFixed(2));
    //console.log(numeratorA, numeratorB)
    //console.log(denominatorA, denominatorB)
    //console.log(multipleA, multipleB)
    process.stdout.write(`Progess: ${Number(prog.toFixed(2)) * 100}% ProgInternal: ${progress * 100}%\n`);
    i++;
    if (done)
        clearInterval(int);
}, 50);
(0, loader_1.load)((event) => {
    progress = event.progress;
}).then(() => {
    console.log("dun");
    done = true;
});
