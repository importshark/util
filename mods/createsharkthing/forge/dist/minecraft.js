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
exports.launchgmllNoAuth = exports.launchgmll = exports.launchNoAuth = exports.launch = void 0;
const minecraft = __importStar(require("minecraft-launcher-core"));
// /import forgefile from "./assets/other/forge-1.19.2-43.2.0.jar"
const gmll_1 = require("gmll");
// eslint-disable-next-line import/no-unresolved
const config_1 = require("gmll/config");
const logger_1 = require("./logger");
const appdata = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const forge = "";
const forgefile = "";
const logger = Object.assign(console, (0, logger_1.getLogger)("minecraft"));
(0, config_1.setRoot)(".MC");
function launch(auth) {
    return new Promise((resolve) => {
        logger.debug("launch ", forge, forgefile);
        const launcher = new minecraft.Client();
        launcher.on("data", x => {
            logger.debug("data");
            logger.debug(x);
        });
        launcher.on('debug', x => {
            logger.debug("debug");
            logger.debug(x);
        });
        launcher.on("close", x => {
            logger.debug("arcloseguments");
            logger.debug(x);
        });
        launcher.on('progress', x => {
            logger.debug("progress");
            logger.debug(x);
        });
        launcher.on('download-status', x => {
            logger.debug("download-status");
            logger.debug(x);
        });
        launcher.on("package-extract", x => {
            logger.debug("arguments");
            logger.debug(x);
        });
        launcher.on('arguments', x => {
            logger.debug("arguments");
            logger.debug(x);
        });
        launcher.on('download', x => {
            logger.debug("download");
            logger.debug(x);
        });
        launcher.launch({
            root: ".MC",
            forge,
            overrides: {
                detached: false
            },
            javaPath: "C:\\Program Files\\Zulu\\zulu-17\\bin\\java.exe",
            authorization: new Promise(x => {
                x({
                    access_token: auth.access_token,
                    client_token: "",
                    uuid: auth.uuid,
                    name: auth.username,
                    user_properties: []
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
    return new Promise((resolve) => {
        logger.debug("launch ", forge, forgefile);
        const launcher = new minecraft.Client();
        launcher.on("data", x => {
            logger.debug("data");
            logger.debug(x);
        });
        launcher.on('debug', x => {
            logger.debug("debug");
            logger.debug(x);
        });
        launcher.on("close", x => {
            logger.debug("arcloseguments");
            logger.debug(x);
        });
        launcher.on('progress', x => {
            logger.debug("progress");
            logger.debug(x);
        });
        launcher.on('download-status', x => {
            logger.debug("download-status");
            logger.debug(x);
        });
        launcher.on("package-extract", x => {
            logger.debug("arguments");
            logger.debug(x);
        });
        launcher.on('arguments', x => {
            logger.debug("arguments");
            logger.debug(x);
        });
        launcher.on('download', x => {
            logger.debug("download");
            logger.debug(x);
        });
        launcher.launch({
            root: ".MC",
            forge,
            overrides: {
                detached: false
            },
            javaPath: "C:\\Program Files\\Zulu\\zulu-17\\bin\\java.exe",
            authorization: new Promise(x => {
                x({
                    access_token: "",
                    client_token: "",
                    uuid: auth.uuid || "",
                    name: auth.username,
                    user_properties: []
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
function launchgmll(auth) {
    return new Promise((resolve) => {
        logger.debug("launch ", forge, forgefile);
        const listener = (0, config_1.getEventListener)();
        listener.on("download.start", () => {
            logger.debug("download.done");
        });
        listener.on("download.done", () => {
            logger.debug("download.done");
        });
        listener.on("encode.start", () => {
            logger.debug("download.start");
        });
        listener.on("encode.progress", x => {
            logger.debug("encode.progress");
            logger.debug(x);
        });
        listener.on("encode.done", () => {
            logger.debug("encode.done");
        });
        listener.on("download.progress", x => {
            logger.debug("download.progress");
            logger.debug(x);
        });
        listener.on("jvm.start", x => {
            logger.debug("jvmstart");
            logger.debug(x);
        });
        listener.on("jvm.stderr", x => {
            logger.debug("jvmerr");
            logger.debug(x);
        });
        listener.on("jvm.stdout", x => {
            logger.debug("jvmout");
            logger.debug(x);
        });
        listener.on("parser.done", x => {
            logger.debug("parser.done");
            logger.debug(x);
        });
        listener.on("parser.fail", x => {
            logger.debug("parser.fail");
            logger.debug(x);
        });
        listener.on("parser.progress", x => {
            logger.debug("parser.progress");
            logger.debug(x);
        });
        listener.on("parser.start", x => {
            logger.debug("parser.start");
            logger.debug(x);
        });
        listener.on("proxy.fail", x => {
            logger.debug("proxyfail");
            logger.debug(x);
        });
        listener.on("proxy.request", x => {
            logger.debug("proxyreq");
            logger.debug(x);
        });
        listener.on("proxy.skinURL", x => {
            logger.debug("proxyskin");
            logger.debug(x);
        });
        listener.on("proxy.skinURL.fail", x => {
            logger.debug("proxyskinfail");
            logger.debug(x);
        });
        listener.on("proxy.start", x => {
            logger.debug("proxystart");
            logger.debug(x);
        });
        (0, gmll_1.init)().then(() => {
            new gmll_1.Instance({
                version: "1.19.2"
            }).launch({
                access_token: auth.access_token,
                profile: {
                    id: auth.uuid,
                    name: auth.username
                }
            }).then(resolve);
        });
    });
}
exports.launchgmll = launchgmll;
function launchgmllNoAuth(auth) {
    return new Promise((resolve) => {
        logger.debug("launch ", forge, forgefile);
        const listener = (0, config_1.getEventListener)();
        listener.on("download.start", () => {
            logger.debug("download.done");
        });
        listener.on("download.done", () => {
            logger.debug("download.done");
        });
        listener.on("encode.start", () => {
            logger.debug("download.start");
        });
        listener.on("encode.progress", x => {
            logger.debug("encode.progress");
            logger.debug(x);
        });
        listener.on("encode.done", () => {
            logger.debug("encode.done");
        });
        listener.on("download.progress", x => {
            logger.debug("download.progress");
            logger.debug(x);
        });
        listener.on("jvm.start", x => {
            logger.debug("jvmstart");
            logger.debug(x);
        });
        listener.on("jvm.stderr", x => {
            logger.debug("jvmerr");
            logger.debug(x);
        });
        listener.on("jvm.stdout", x => {
            logger.debug("jvmout");
            logger.debug(x);
        });
        listener.on("parser.done", x => {
            logger.debug("parser.done");
            logger.debug(x);
        });
        listener.on("parser.fail", x => {
            logger.debug("parser.fail");
            logger.debug(x);
        });
        listener.on("parser.progress", x => {
            logger.debug("parser.progress");
            logger.debug(x);
        });
        listener.on("parser.start", x => {
            logger.debug("parser.start");
            logger.debug(x);
        });
        listener.on("proxy.fail", x => {
            logger.debug("proxyfail");
            logger.debug(x);
        });
        listener.on("proxy.request", x => {
            logger.debug("proxyreq");
            logger.debug(x);
        });
        listener.on("proxy.skinURL", x => {
            logger.debug("proxyskin");
            logger.debug(x);
        });
        listener.on("proxy.skinURL.fail", x => {
            logger.debug("proxyskinfail");
            logger.debug(x);
        });
        listener.on("proxy.start", x => {
            logger.debug("proxystart");
            logger.debug(x);
        });
        (0, gmll_1.init)().then(() => {
            new gmll_1.Instance({
                version: "1.19.2"
            }).launch({
                profile: {
                    id: auth.uuid || "",
                    name: auth.username
                }
            }).then(resolve);
        });
    });
}
exports.launchgmllNoAuth = launchgmllNoAuth;
//# sourceMappingURL=minecraft.js.map