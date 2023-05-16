"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const regedit_1 = require("regedit");
const deasync_1 = __importDefault(require("deasync"));
const rootkeys = ["HKLM", "HKCU"];
const browsers = ["chrome.exe", "vivaldi.exe", "brave.exe", "blisk.exe", "msedge.exe"];
const found = {};
function test(path) {
    return new Promise((resolve, reject) => {
        regedit_1.promisified.list([path]).then((value) => {
            let data = value[path];
            if (!data.exists)
                resolve(false);
            if (!data.values["Path"])
                resolve(false);
            resolve(data.values["Path"]?.value.toString());
        }).catch(x => {
            console.log("error!");
            console.log(x);
            reject(x);
        });
    });
}
function testwrap(path) {
    let value = false;
    let done = false;
    test(path).then((ret) => {
        value = ret;
        done = true;
    }).catch(x => {
        console.log("e ");
        console.log(x);
    });
    while (!done) {
        deasync_1.default.sleep(100);
    }
    return value;
}
function run() {
    for (let i = 0; i < rootkeys.length; i++) {
        const root = rootkeys[i];
        for (let j = 0; j < browsers.length; j++) {
            const browserkey = browsers[j];
            const path = `${root}\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\${browserkey}`;
            let val = testwrap(path);
            if (val) {
                found[browserkey] = val;
            }
            //console.log(path)
        }
    }
    for (let j = 0; j < browsers.length; j++) {
        const element = browsers[j];
        if (found[element]) {
            throw new Error(found[element]);
        }
    }
}
run();
