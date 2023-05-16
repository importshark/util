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
exports.get = exports.checkWifi = exports.setKeys = exports.getKey = void 0;
const regedit_1 = require("regedit");
const deasync_1 = __importDefault(require("deasync"));
const https = __importStar(require("https"));
const crypto_1 = require("crypto");
const fs = __importStar(require("fs"));
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
            return {
                browser: found[element],
                app: element
            };
        }
    }
}
exports.get = run;
function generateKey() {
    return (0, crypto_1.randomBytes)(16).toString("hex");
}
function teste(key, file) {
    const algorithm = "aes-256-cbc";
    // generate 16 bytes of random data
    const initVector = (0, crypto_1.randomBytes)(16);
    // protected data
    const message = JSON.stringify(file);
    // secret key generate 32 bytes of random data
    const Securitykey = key;
    // the cipher function
    const cipher = (0, crypto_1.createCipheriv)(algorithm, Securitykey, initVector);
    // encrypt the message
    // input encoding
    // output encoding
    let encryptedData = cipher.update(message, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    console.log("Encrypted message: " + encryptedData);
    // the decipher function
    const decipher = (0, crypto_1.createDecipheriv)(algorithm, Securitykey, initVector);
    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    console.log("Decrypted message: ");
    console.log(JSON.parse(decryptedData));
}
function getKey() {
    const algorithm = 'aes-192-cbc';
    const password = 'assword used to generate key';
    // Key length is dependent on the algorithm. In this case for aes192, it is
    // 24 bytes (192 bits).
    // Use the async `crypto.scrypt()` instead.
    (0, crypto_1.scrypt)(password, 'sat', 24, (err, key) => {
        if (err)
            throw err;
        // Once we have the key and iv, we can create and use the cipher...
        const cipher = (0, crypto_1.createDecipheriv)(algorithm, key, Buffer.alloc(16, 0));
        let encrypted = '';
        cipher.setEncoding('hex');
        cipher.on('data', (chunk) => encrypted += chunk.toString("utf-8"));
        cipher.on('end', () => console.log(encrypted));
        cipher.write(fs.readFileSync("./data.dump").toString(), "hex");
        cipher.end();
    });
}
exports.getKey = getKey;
function setKeys(file) {
    const algorithm = 'aes-192-cbc';
    const password = 'assword used to generate key';
    // First, we'll generate the key. The key length is dependent on the algorithm.
    // In this case for aes192, it is 24 bytes (192 bits).    
    (0, crypto_1.scrypt)(password, 'sat', 24, (err, key) => {
        if (err)
            throw err;
        // Then, we'll generate a random initialization randomFill(new Uint8Array(16), (err, iv) => {
        if (err)
            throw err;
        // Once we have the key and iv, we can create and use the cipher...
        const cipher = (0, crypto_1.createCipheriv)(algorithm, key, Buffer.alloc(16, 0));
        let encrypted = '';
        cipher.setEncoding('hex');
        cipher.on('data', (chunk) => encrypted += chunk);
        cipher.on('end', () => fs.writeFileSync("./data.dump", encrypted));
        cipher.write("some clear text data");
        cipher.end();
    });
}
exports.setKeys = setKeys;
/*
setKeys({account: {access_token: "", expires_in: 0, msaccess_token: "", msrefesh_token: "", ownsGame: true, profile: {activeskin: {id: "", state: "ACTIVE", url: "", variant: "CLASSIC"}, capes: [{alias: "", id: "", state: "ACTIVE", url: ""}], id: "", name: "", profileActions: {}, skins: []}, username: "", uuid: ""}})
getKey()
*/
teste(generateKey(), { account: { access_token: "", expires_in: 0, msaccess_token: "", msrefesh_token: "", ownsGame: true, profile: { activeskin: { id: "", state: "ACTIVE", url: "", variant: "CLASSIC" }, capes: [{ alias: "", id: "", state: "ACTIVE", url: "" }], id: "", name: "", profileActions: {}, skins: [] }, username: "", uuid: "" } });
function checkWifi() {
    return new Promise((resolve, reject) => {
        resolve(true);
        const socket = https.request("https://google.com");
        socket.setTimeout(3000);
        socket.on('connect', () => {
            socket.end();
            resolve(true);
        });
        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });
        socket.on('error', (e) => {
            console.log(e.message);
            socket.destroy();
            resolve(e);
        });
    });
}
exports.checkWifi = checkWifi;
