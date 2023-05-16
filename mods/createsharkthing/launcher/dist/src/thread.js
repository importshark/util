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
const worker_threads_1 = require("worker_threads");
const gmll = __importStar(require("gmll"));
const config_1 = require("gmll/config");
let data = worker_threads_1.workerData;
switch (data.task) {
    case "mc-prep":
        console.log("thread starting");
        (0, config_1.setRoot)(".MC");
        gmll.init().then(x => {
            new gmll.Instance({
                version: "1.19.2"
            }).install().then(x => {
                worker_threads_1.parentPort?.postMessage(`install-finish ${x.manifest.type}`);
            }).catch(x => {
                worker_threads_1.parentPort?.postMessage(`install-error ${x}`);
            });
        }).catch(x => {
            worker_threads_1.parentPort?.postMessage(`init-error ${x}`);
        });
        break;
}
