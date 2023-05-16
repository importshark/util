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
exports.launchNoAuth = exports.launch = void 0;
const minecraft = __importStar(require("minecraft-launcher-core"));
const path_1 = require("path");
const assetloader_1 = require("./assetloader");
let appdata = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
function getMSA() {
}
function launch(auth) {
    return new Promise((resolve, reject) => {
        let launcher = new minecraft.Client();
        launcher.on("data", console.log);
        launcher.on('debug', console.log);
        launcher.launch({
            root: (0, path_1.join)(__dirname, ".MC"),
            forge: (0, assetloader_1.getPath)("forge-1.19.2-43.2.0.jar", "other"),
            overrides: {
                detached: false
            },
            javaPath: "C:\\Program Files\\Zulu\\zulu-17\\bin\\java.exe",
            authorization: new Promise(x => {
                x({
                    access_token: auth.access_token,
                    client_token: "",
                    uuid: auth.uuid,
                    name: auth.username
                });
            }),
            version: {
                number: "1.19.2",
                type: "release"
            },
            memory: {
                min: 2000,
                max: 4000
            }
        }).then(child => {
            resolve(child);
        });
    });
}
exports.launch = launch;
function launchNoAuth(auth) {
    return new Promise((resolve, reject) => {
        let launcher = new minecraft.Client();
        launcher.on("data", console.log);
        launcher.on('debug', console.log);
        launcher.launch({
            root: (0, path_1.join)(__dirname, ".MC"),
            forge: (0, assetloader_1.getPath)("forge-1.19.2-43.2.0.jar", "other"),
            overrides: {
                detached: false
            },
            javaPath: "C:\\Program Files\\Zulu\\zulu-17\\bin\\java.exe",
            authorization: new Promise(x => {
                x({
                    access_token: "",
                    client_token: "",
                    uuid: auth.uuid || "",
                    name: auth.username
                });
            }),
            version: {
                number: "1.19.2",
                type: "release"
            },
            memory: {
                min: 2000,
                max: 4000
            }
        }).then(child => {
            resolve(child);
        });
    });
}
exports.launchNoAuth = launchNoAuth;
/*
launch({
    token: "",
    name: "ASharkInTheVoid",
    uuid: ""
}).then(x => {
    x?.stdout.on("data", (chunk) => {
        console.log(chunk.toString())
    })
    x?.stderr.on("data", (chunk) => {
        console.log(chunk.toString())
    })
})*/ 
