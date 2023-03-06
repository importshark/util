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
const minecraft = __importStar(require("minecraft-launcher-core"));
let appdata = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
function getMSA() {
}
function checkWifi() {
}
function launch() {
    return new Promise((resolve, reject) => {
        let launcher = new minecraft.Client();
        launcher.on("data", console.log);
        launcher.on('debug', console.log);
        launcher.launch({
            root: "./cache/minecraft",
            javaPath: "C:\\Program Files\\Zulu\\zulu-17\\bin\\java.exe",
            authorization: new Promise(x => {
                x({
                    access_token: "eyJraWQiOiJhYzg0YSIsImFsZyI6IkhTMjU2In0.eyJ4dWlkIjoiMjUzNTQ2NjY0Njc1NzI1NyIsImFnZyI6IkFkdWx0Iiwic3ViIjoiODE0NjM3MDctYzI4Ni00NDQwLWExODktZDM4M2ZjZDliMTk0IiwiYXV0aCI6IlhCT1giLCJucyI6ImRlZmF1bHQiLCJyb2xlcyI6W10sImlzcyI6ImF1dGhlbnRpY2F0aW9uIiwicGxhdGZvcm0iOiJVTktOT1dOIiwieXVpZCI6ImFmZjcwZjRmZDc1NTcxM2EwYjc3YTJiMGQ1ZDRjZTYxIiwibmJmIjoxNjc3ODg5MzMxLCJleHAiOjE2Nzc5NzU3MzEsImlhdCI6MTY3Nzg4OTMzMX0.NhCl601EtLpmQzm-foznHclm1890kCyjLGjAYBk_QPA",
                    client_token: "",
                    uuid: "11178be5ebed45dfa473d770fd085c6d",
                    name: "ASharkInTheVoid"
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
launch().then(x => {
    x === null || x === void 0 ? void 0 : x.stdout.on("data", (chunk) => {
        console.log(chunk.toString());
    });
    x === null || x === void 0 ? void 0 : x.stderr.on("data", (chunk) => {
        console.log(chunk.toString());
    });
});
