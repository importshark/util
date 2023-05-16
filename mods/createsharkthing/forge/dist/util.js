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
exports.runThread = exports.checkWifi = exports.reminisce = exports.forget = exports.remember = exports.getCode = void 0;
const logger_1 = require("./logger");
const worker_threads_1 = require("worker_threads");
const [logger, worklogger] = [(0, logger_1.getLogger)("app"), (0, logger_1.getLogger)("workers")];
const fs = __importStar(require("fs"));
const promises_1 = require("fs/promises");
/*
open("./logs", (err) => {
    console.log(err)
})
*/
function getCode(url) {
    const index = url.indexOf("?");
    const newstring = url.substring(index);
    const search = new URLSearchParams(newstring);
    return search.get("code");
}
exports.getCode = getCode;
function encode(data) {
    return Buffer.from(data).toString("base64");
}
function decode(data) {
    return Buffer.from(data, "base64").toString();
}
function remember(data, save) {
    return new Promise((resolve) => {
        try {
            let stringdata;
            if (!save && typeof save == "boolean") {
                stringdata = JSON.stringify({
                    save: false
                });
            }
            else {
                stringdata = JSON.stringify({
                    save: true,
                    auth: data
                });
            }
            logger.info("Saving data: " + stringdata);
            (0, promises_1.writeFile)("./memory.save", encode(stringdata), {
                flag: "w"
            }).then(resolve).catch(y => {
                logger.error("Remember failed save because of error: ", y);
            });
        }
        catch (err) {
            logger.error("Remember error! ", err);
        }
    });
}
exports.remember = remember;
function forget() {
    return new Promise((resolve) => {
        try {
            logger.info("Forgetting data...");
            (0, promises_1.unlink)("./memory.save").then(() => {
                resolve(true);
            }).catch(y => {
                logger.error("Forget failed save because of error: ", y);
                resolve(false);
            });
        }
        catch (err) {
            logger.error("Forget error! ", err);
            resolve(false);
        }
    });
}
exports.forget = forget;
function reminisce() {
    return new Promise((resolve) => {
        if (!fs.existsSync("./memory.save"))
            return resolve(false);
        (0, promises_1.readFile)("./memory.save").then(x => {
            try {
                const basestring = x.toString();
                const json = JSON.parse(decode(basestring));
                resolve(json);
            }
            catch (e) {
                logger.error("Reminisce failed ", e);
            }
        }).catch(y => {
            logger.error("reminisce failed save because of error: ", y);
        });
    });
}
exports.reminisce = reminisce;
function checkWifi() {
    return new Promise((resolve) => {
        try {
            //const socket = fetch("https://api.ipify.org/?format=json");
            //logger.trace("Check wifi needs to be set for ipv4 host")
            resolve({
                wifi: true
            });
            setTimeout(resolve, 3000);
            /*socket.then((x) => {
                x.json().then((y: any) => {
                    resolve({
                        err: undefined,
                        ip: < ipobject > y,
                        wifi: true
                    })
                })
            })*/
        }
        catch (e) {
            logger.warn("Check wifi failed with error " + e);
            resolve({
                err: undefined,
                ip: undefined,
                wifi: false
            });
        }
    });
}
exports.checkWifi = checkWifi;
function runThread(workerData) {
    const worker = new worker_threads_1.Worker(__filename, {
        workerData
    });
    worker.stdout.on("data", (msg) => {
        worklogger.info(`Worker running task ${workerData.task} sent out message: ${String(msg).trim()}`);
    });
    worker.stderr.on("data", (msg) => {
        worklogger.info(`Worker running task ${workerData.task} sent err message: ${String(msg).trim()}`);
    });
    return worker;
}
exports.runThread = runThread;
//console.log(run())
//# sourceMappingURL=util.js.map