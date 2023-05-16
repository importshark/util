"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = void 0;
const timer_node_1 = require("timer-node");
const fs = __importStar(require("fs"));
let json = JSON.parse(fs.readFileSync("./loaderdata.json").toString());
function refresh(save) {
    switch (save) {
        case true:
            fs.writeFileSync("./loaderdata.json", JSON.stringify(json, null, 2));
            break;
        case false:
            json = JSON.parse(fs.readFileSync("./loaderdata.json").toString());
            break;
    }
}
let timer = new timer_node_1.Timer();
let data = [{
        name: 0,
        total: 0,
        fromlast: 0
    }];
function load(update) {
    return new Promise((resolve) => {
        timer.start();
        let i = 0;
        let progress = 0;
        let timeout = setInterval(() => {
            i++;
            progress += 25;
            update({
                progress: progress / 100,
                name: "Yay"
            });
            if (i > 3) {
                clearInterval(timeout);
                timer.stop();
                timer.clear();
                resolve();
            }
        }, 2000);
    });
}
exports.load = load;
function average() {
    refresh(false);
    let divisions = {};
    let data = {};
    let finalData = {};
    json.instances.forEach(x => {
        x.averages.forEach(element => {
            if (!data[element.name])
                data[element.name] = {
                    name: element.name,
                    total: element.total,
                    fromlast: 0
                };
            if (!divisions[element.name])
                divisions[element.name] = 0;
            data[element.name].fromlast += element.fromlast;
            divisions[element.name] += 1;
        });
    });
    console.log(divisions);
    console.log(data);
    for (const key in data) {
        let value = data[key];
        finalData[value.name] = {
            fromlast: value.fromlast / divisions[value.name],
            name: value.name,
            total: value.total
        };
    }
    json.averages = finalData;
    refresh(true);
}
/*
let running = false;
let y = 0;

setInterval(() => {

    if(running) return;
    if(y < 500){
    running = true;
    load((event) => {
        console.log(event.progress)
        let time = timer.ms()
        let last = data[data.length - 1]
        console.log(last)
        data.push({
            name: event.progress,
            total: time,
            fromlast: time - last.total
        })
    }).then(() => {
        json.instances.push({
            "averages": data
        })
        running = false
        data = [{
            name: 0,
            total: 0,
            fromlast: 0
        }]
        y++;
        refresh(true)

        
    })
}else{
    
average()
}
})
    





*/ 
