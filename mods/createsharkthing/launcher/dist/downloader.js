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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("https"));
const path_1 = require("path");
const fs = __importStar(require("fs"));
const adm_zip_1 = __importDefault(require("adm-zip"));
if (process.platform != "win32" && process.platform != "darwin")
    throw new Error("Must be run on Windows or Mac!");
let downloads = {
    "win32": {
        url: "https://download.oracle.com/java/17/archive/jdk-17.0.6_windows-x64_bin.zip",
        file: "jdk-17.0.6_windows-x64_bin.zip"
    },
    "darwin": {
        url: "https://download.oracle.com/java/17/archive/jdk-17.0.6_macos-x64_bin.tar.gz",
        file: "jdk-17.0.6_macos-x64_bin.tar.gz"
    }
};
if (process.platform != "win32" && process.platform != "darwin")
    throw new Error("Must be run on Win or Mac");
let { url, file } = downloads[process.platform];
function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest, { flags: "wx" });
        const request = http.get(url, response => {
            if (response.statusCode === 200) {
                response.pipe(file);
            }
            else {
                file.close();
                fs.unlink(dest, () => { }); // Delete temp file
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            }
        });
        request.on("error", err => {
            console.log("death");
            console.log(err);
            file.close();
            fs.unlink(dest, () => { }); // Delete temp file
            reject(err);
        });
        request.on("information", (info) => {
            console.log(info);
        });
        request.on("response", (res) => {
            res.on("data", (chunk) => {
                console.log(chunk.toString());
            });
        });
        request.on("close", () => {
            console.log("maybe oh noes idk");
            resolve(true);
        });
        request.on("timeout", () => {
            console.log("Oh noes");
            reject();
        });
        file.on("finish", () => {
            resolve(true);
        });
        file.on("error", err => {
            file.close();
        });
    });
}
let i = 0;
let max = 3;
function downloadWrapper(url, dest) {
    return new Promise((resolve, reject) => {
        download(url, dest).then(async (x) => {
            if (!fs.existsSync(`./java/${file}`)) {
                i++;
                if (i >= 3) {
                    console.log("Download failed final time! Exiting.");
                    reject();
                }
                console.log(`Download failed! Retrying ${i} / ${max}.`);
                resolve(await downloadWrapper(url, dest));
            }
            else {
                resolve(x);
            }
        }).catch(async (y) => {
            i++;
            if (i >= 3) {
                console.log("Download failed final time! Exiting.");
                reject();
            }
            console.log(`Download failed! Retrying ${i} / ${max}.`);
            resolve(await downloadWrapper(url, dest));
            console.log("y " + y.code);
            reject(y);
        });
    });
}
async function run() {
    await download(url, (0, path_1.resolve)(__dirname, `./java/${file}`)).then(x => {
        console.log("x " + x);
        let zip = new adm_zip_1.default(`./java/${file}`);
        zip.extractAllTo(`./java/`);
        fs.rmSync(`./java/${file}`);
    }).catch(y => {
        console.log("y " + y.code);
    });
}
exports.default = run;
run();
