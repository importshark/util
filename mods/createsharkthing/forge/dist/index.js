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
const electron_1 = require("electron");
const launcher = __importStar(require("./minecraft"));
//import * as assets from "./assetloader"
const worker_threads_1 = require("worker_threads");
const auth_1 = require("./auth");
const util_1 = require("./util");
const index_types_1 = require("./types/index.types");
const config_1 = require("gmll/config");
const forge_1_19_2_43_2_0_jar_1 = __importDefault(require("./assets/other/forge-1.19.2-43.2.0.jar"));
const logger_1 = require("./logger");
const gmll = __importStar(require("gmll"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const logo256_ico_1 = __importDefault(require("./assets/images/logo256.ico"));
//get logger
const logger = (0, logger_1.getLogger)("app");
//get renderer logger
const renderlogger = (0, logger_1.getLogger)("renderer");
//If app is installing
if (require("electron-squirrel-startup"))
    electron_1.app.quit();
let memorystate;
let authstate = {
    state: 0,
    online: 1
};
const mcready = new index_types_1.varlistener(0);
function TokenCheckResponse(memory) {
    logger.debug("TokenCheckResponserizer memory: ", memory);
    if (authstate.state == 0 && authstate.online == 0) {
        return {
            auth: {
                state: 0,
                online: 0
            },
            memory: (0, index_types_1.stripData)(memory),
            status: mcready.value || 0
        };
    }
    if (authstate.state == 0 && authstate.online == 1) {
        return {
            auth: {
                state: 0,
                online: 1
            },
            memory: (0, index_types_1.stripData)(memory),
            status: mcready.value || 0
        };
    }
    if (authstate.online == 0) {
        return {
            auth: {
                state: 1,
                online: 0,
                username: authstate.username
            },
            memory: (0, index_types_1.stripData)(memory),
            status: mcready.value || 0
        };
    }
    else {
        if (authstate.state == 1) {
            return {
                auth: {
                    state: 1,
                    online: 1,
                    code: !!authstate.code
                },
                memory: (0, index_types_1.stripData)(memory),
                status: mcready.value || 0
            };
        }
        else {
            return {
                auth: {
                    state: 2,
                    online: 1,
                    code: !!authstate.code,
                    result: !!authstate.result
                },
                memory: (0, index_types_1.stripData)(memory),
                status: mcready.value || 0
            };
        }
    }
}
function setupMc(setup) {
    mcready.set(1);
    (0, util_1.runThread)({
        task: "mc-prep"
    }).on("message", (msg) => {
        logger.info("Thread running task mc-prep sent message: " + msg);
        if (String(msg).startsWith("mc-fail")) {
            logger.error("Mc failed! See log above");
            mcready.set(0);
            if (setup)
                window.webContents.send("error", "base-setup-mc");
            window.webContents.send("error");
        }
        else if (String(msg).startsWith("mc-succ")) {
            const message = String(msg).substring(8);
            logger.info("mc-prep success! success message: ", message);
            mcready.set(2);
        }
        else if (String(msg).startsWith("thre-fail")) {
            const message = String(msg).substring(10);
            logger.info("Thread failed with reason: ", message);
            mcready.set(0);
            if (setup)
                window.webContents.send("error", "base-setup-mc");
        }
    }).on("exit", (code) => {
        logger.info("Thread running task mc-prep exited with code: " + code);
        if (code == 1) {
            logger.error("Thread running task mc-prep exited with code 1 that's a problem. CLient probably already knows but sending message anyway");
            window.webContents.send("error", setup ? "base-setup-mc" : undefined);
        }
    });
}
function startProceses() {
    logger.debug("Start proc called ");
    return new Promise((resolve) => {
        (0, util_1.reminisce)().then(x => {
            if (x) {
                logger.info("Memory passed check Exists: ", x);
            }
            else
                logger.warn("Memory does not exist! Probably fine?");
            memorystate = (0, index_types_1.evalMemory)(x);
            logger.debug("Memory state after eval is: ", memorystate);
            logger.info("Starting minecraft process");
            //setupMc(true)
            mcready.set(2);
            resolve();
        }).catch(y => {
            logger.error("Encountered error in base setup!");
            logger.error(y);
            window.webContents.send("error", "base-setup");
            resolve();
        });
    });
}
let window;
let authhandleregistered = false;
let authwinfail = false;
let winontop = true;
let username;
//webapp starts auth
function authWindow(parent, show) {
    logger.info("Auth call. ");
    const widthratio = 600 / electron_1.screen.getPrimaryDisplay().bounds.width;
    const heightratio = 800 / electron_1.screen.getPrimaryDisplay().bounds.height;
    const authWin = new electron_1.BrowserWindow({
        width: electron_1.screen.getPrimaryDisplay().bounds.width * widthratio,
        height: electron_1.screen.getPrimaryDisplay().bounds.height * heightratio,
        frame: false,
        x: parent.getPosition()[0],
        y: parent.getPosition()[1],
        resizable: false,
        movable: false,
        parent,
        show: false
    });
    authWin.on("ready-to-show", () => {
        if (authWin.isDestroyed())
            return;
        authWin.show();
    });
    authWin.webContents.debugger.on("message", (ev, method, params) => {
        logger.debug("DebuggerConsole", method, params);
    });
    authWin.webContents.on("will-redirect", (ev, url) => {
        logger.debug("About to redirect to " + url);
        if (url.startsWith("http://localhost:27356")) {
            authWin.webContents.stop();
            const urlcode = (0, util_1.getCode)(url);
            if (!urlcode) {
                logger.error("No code found on url " + url);
                return window.webContents.send("error");
            }
            authstate = {
                online: 1,
                state: 1,
                code: urlcode
            };
            return authWin.close();
        }
    });
    authWin.webContents.on("did-fail-load", () => {
        logger.error("Auth win failed load");
        window.webContents.send("error");
        authWin.close();
    });
    if (!show) {
        electron_1.ipcMain.once("auth-show", () => {
            if (authWin.isDestroyed())
                return;
            authWin.show();
        });
    }
    authWin.on("closed", () => {
        authWin.removeAllListeners();
        window.webContents.send("auth-close", {
            err: authwinfail
        });
    });
    authWin.on("show", () => {
        window.webContents.send("auth-show");
    });
    logger.debug("authhandle " + authhandleregistered);
    if (!authhandleregistered) {
        logger.debug("Registering auth handler");
        authhandleregistered = true;
        electron_1.ipcMain.handleOnce("auth-handle", () => {
            authhandleregistered = false;
            if (authstate.online == 0 || authstate.state == 0) {
                logger.warn("Encountered exception in auth handle listener. Authstate online is false or state is 0: ", authstate);
                logger.silly("Do we need to let the client know? probably");
                return;
            }
            logger.info("Auth handle worker starting");
            const worker = (0, util_1.runThread)({
                task: "auth-handle",
                data: authstate.code
            });
            worker.on("message", (data) => {
                logger.info("Auth handle worker sends message: " + data);
                const message = String(data);
                if (message.startsWith("auth-fail")) {
                    logger.error("auth handler failed?");
                    const reason = message.substring(10);
                    window.webContents.send("error", reason);
                }
                else if (message.startsWith("auth-succ")) {
                    logger.error("auth handler success");
                    let json;
                    try {
                        json = JSON.parse(message.substring(10));
                    }
                    catch (error) {
                        logger.error("Couldn't parse JSON because of error " + error);
                        window.webContents.send("error");
                    }
                    if (!json["access_token"]) {
                        logger.error("Did not find minecraft access token on auth info!");
                        window.webContents.send("error");
                    }
                    if (authstate.online == 0 || authstate.state == 0) {
                        logger.error("Lost track of code as authstate got changed somehow? ", authstate);
                        logger.silly("Client error?");
                        return;
                    }
                    authstate = {
                        online: 1,
                        state: 2,
                        result: json,
                        code: authstate.code
                    };
                    window.webContents.send("auth-done", authstate.result.ownsGame);
                }
            });
            worker.on("exit", (code) => {
                logger.info("auth handler exited code: ", code);
            });
        });
    }
    logger.info("Loading auth!");
    authWin.loadURL((0, auth_1.getLink)()).catch(y => {
        logger.info("authfail sent");
        authwinfail = y;
        if (authWin.isDestroyed()) {
            return window.webContents.send("auth-close", {
                err: authwinfail
            });
        }
        else {
            authWin.close();
        }
    });
}
function appStart() {
    logger.info("Starting window");
    const widthratio = 600 / electron_1.screen.getPrimaryDisplay().bounds.width;
    const heightratio = 800 / electron_1.screen.getPrimaryDisplay().bounds.height;
    const mainWindow = new electron_1.BrowserWindow({
        width: electron_1.screen.getPrimaryDisplay().bounds.width * widthratio,
        height: electron_1.screen.getPrimaryDisplay().bounds.height * heightratio,
        frame: true,
        alwaysOnTop: false,
        closable: true,
        center: true,
        show: true,
        hasShadow: false,
        skipTaskbar: false,
        icon: logo256_ico_1.default,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
        }
    });
    window = mainWindow;
    mainWindow.flashFrame(false);
    //send console output to renderlogger
    mainWindow.webContents.on("console-message", (ev, l, m) => {
        renderlogger.info("console: " + m);
    });
    /*window.webContents.beginFrameSubscription(true, (img, rect) => {

        runThread({
            task: "image-save",
            increment: true,
            data: img.toPNG()
        })

    })*/
    //mainWindow.setOpacity(.5)
    //"D:\\Projects\\Misc\\util\\mods\\createsharkthing\\forge\\.webpack\\renderer\\main_window\\index.html"
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    //Process window triggers
    electron_1.ipcMain.handle("window-close", () => {
        logger.info("User initiated window close");
        mainWindow.close();
    });
    electron_1.ipcMain.handle("test", (ev, arg) => {
        logger.info("User initiated test: " + arg);
        if (arg == "log") {
            (0, util_1.runThread)({
                task: "log-get"
            }).on("message", (msg) => {
                logger.info("Thread running task log-get sent message: " + msg);
            }).on("exit", (code) => {
                logger.info("Thread running task log-get exited with code: " + code);
            });
        }
    });
    function checkAuth(arg) {
        return new Promise((resolve) => {
            try {
                //check auth state
                if (arg) {
                    authstate = {
                        online: 0,
                        state: 1,
                        username: arg
                    };
                    logger.info("Modified authstate as got username");
                }
                if (authstate.state == 0) {
                    logger.warn("Auth has not even initialized yet!");
                }
                if (authstate.online == 0) {
                    if (authstate.state == 0) {
                        logger.warn("Username has not been set yet!");
                        resolve(false);
                    }
                    else {
                        logger.warn("State indicates username exists.");
                        if (!authstate.username) {
                            logger.warn("Username was not on obect and now sending redo message to client");
                            logger.silly("What is the redo message");
                            resolve(false);
                        }
                        else
                            resolve(true);
                    }
                }
                else {
                    if (authstate.state == 0) {
                        resolve(false);
                    }
                    else if (authstate.state == 1) {
                        const code = authstate.code;
                        //workable. We can run the auth from here.
                        (0, util_1.runThread)({
                            task: "auth-handle",
                            data: code
                        }).on("message", (message) => {
                            logger.info("Thread running in prep mc for auth handle sent message: " + message);
                            if (String(message).startsWith("auth-succ")) {
                                try {
                                    authstate;
                                    //authstate.result = JSON.parse(String(message).substring(10))
                                    const object = {
                                        result: JSON.parse(String(message).substring(10)),
                                        online: 1,
                                        state: 2,
                                        code
                                    };
                                    authstate = object;
                                    resolve(true);
                                    //authstate.state = 2;
                                }
                                catch (e) {
                                    logger.warn("Error in handling auth from prep mc! Restarting auth handle process through sending front end message");
                                    resolve(false);
                                }
                            }
                            else if (String(message).startsWith("auth-fail")) {
                                logger.info("Auth fail message!");
                                logger.silly("Need message to let client know to restart auth if required.");
                                resolve(false);
                            }
                        });
                    }
                    else {
                        //fully ready
                        resolve(true);
                    }
                }
            }
            catch (e) {
                logger.warn("Check failed with error " + e);
            }
        });
    }
    function checkMC() {
        return new Promise((resolve) => {
            try {
                //check auth state
                if (mcready.value == 0) {
                    //run thread to start
                    mcready.set(1);
                    (0, util_1.runThread)({
                        task: "mc-prep"
                    }).on("message", (message) => {
                        logger.info("Thread running in prep mc for auth handle sent message: " + message);
                        if (String(message).startsWith("mc-succ")) {
                            mcready.set(2);
                            resolve(true);
                        }
                        else if (String(message).startsWith("mc-fail")) {
                            mcready.set(0);
                            resolve(false);
                        }
                    });
                }
                else if (mcready.value == 1) {
                    logger.info("Mc still getting ready. Waiting to send true");
                    mcready.addListener((old, newvalue) => {
                        if (newvalue == 2)
                            resolve(true);
                        else if (newvalue == 0) {
                            logger.warn("Value got set to 0. This usually only happens if there's an error!");
                            resolve(false);
                        }
                    });
                }
                else {
                    resolve(true);
                }
            }
            catch (e) {
                logger.warn("MC Check failed with error " + e);
            }
        });
    }
    electron_1.ipcMain.handle("set-user", (ev, arg) => {
        authstate = {
            online: 0,
            state: 1,
            username: arg
        };
        logger.info("Set user per client request User: " + arg);
    });
    electron_1.ipcMain.handle("save-account", (ev, arg) => {
        logger.info("Saving account as per message");
        logger.silly("Create state and wait for event");
        if (arg == "false") {
            logger.info("Arg is false remembering false?");
            return (0, util_1.remember)({
                username: ""
            }, false);
        }
        if (authstate.state == 0) {
            logger.warn("Tried to save account while state was 0. Sending ready event to client");
            return mainWindow.webContents.send("ready");
        }
        if (authstate.online == 0) {
            (0, util_1.remember)({
                username: authstate.username
            });
        }
        else {
            if (authstate.state == 1) {
                logger.warn("Not quite ready. Running auth handle?");
                const code = authstate.code;
                (0, util_1.runThread)({
                    task: "auth-handle",
                    data: code
                }).on("message", (message) => {
                    logger.info("Thread running in prep mc for auth handle sent message: " + message);
                    if (String(message).startsWith("auth-succ")) {
                        try {
                            authstate;
                            //authstate.result = JSON.parse(String(message).substring(10))
                            const object = {
                                result: JSON.parse(String(message).substring(10)),
                                online: 1,
                                state: 2,
                                code: code
                            };
                            authstate = object;
                            authstate.state = 2;
                            if (!authstate.result.ownsGame) {
                                logger.info("Doesn't own game during save account auth handle");
                                logger.silly("Need message to let client know probably");
                                return;
                            }
                            (0, util_1.remember)({
                                auth: authstate.result
                            });
                        }
                        catch (e) {
                            logger.warn("Error in handling auth from prep mc! Restarting auth handle process through sending front end message");
                        }
                    }
                    else if (String(message).startsWith("auth-fail")) {
                        logger.info("Auth fail message!");
                        logger.silly("Need message to let client know to restart auth if required.");
                    }
                });
            }
            else {
                if (!authstate.result.ownsGame) {
                    logger.info("Doesn't own game during save account auth check");
                    logger.silly("Need message to let client know probably");
                    return;
                }
                (0, util_1.remember)({
                    auth: authstate.result
                });
            }
        }
    });
    electron_1.ipcMain.handle("use-account", (ev, arg) => {
        logger.info("Use account");
        logger.silly("Create state and wait for event");
        if (arg == "false") {
            logger.info("Use account is false. Forgetting it.");
            memorystate = {
                state: 0
            };
            (0, util_1.forget)().then(() => {
                logger.info("Forgetting complete. Sending ready event");
                mainWindow.webContents.send("ready");
            }).catch(e => {
                logger.warn("Error forgetting. This might be a problem but should be fine as the memory is never reloaded");
                mainWindow.webContents.send("ready");
            });
        }
        else {
            logger.info("Use account is true. Transferring the memory to auth state.");
            if (memorystate.state <= 2) {
                if (memorystate.state == 2)
                    logger.info(`Memory state is 2. Exiting as that indicates memory is not to be used.`);
                else
                    logger.info(`Memory state is ${memorystate.state}. This shouldn't be called at this stage! Sending ready event`);
                mainWindow.webContents.send("ready");
                return;
            }
            console.error("id: beta. Dev error at line 722. index.ts how do we get the code?");
            switch (memorystate.state) {
                case 3:
                    if (memorystate.online == 0) {
                        authstate = {
                            online: memorystate.online,
                            username: memorystate.auth,
                            state: 1
                        };
                    }
                    else {
                        authstate = {
                            online: memorystate.online,
                            result: memorystate.auth,
                            state: 2,
                            code: ""
                        };
                    }
                    break;
                default:
                    logger.error("id: alpha. Dev level problem: this should have been caught in the function above. Memory state is " + memorystate.state);
                    break;
            }
        }
    });
    electron_1.ipcMain.handle("prep-mc", (ev, arg) => {
        logger.info("Prepping mc");
        Promise.all([checkAuth(arg), checkMC()]).then(array => {
            //first is check auth
            if (!array[0]) {
                logger.warn("Auth failed test. Sending message");
                logger.silly("Is mc-fail the right message?");
                return mainWindow.webContents.send("mc-fail");
            }
            logger.info("Assuming auth suceeded as fail did not get called");
            if (!array[1]) {
                logger.warn("Mc failed test. Sending message");
                logger.silly("Is mc-fail the right message?");
                return mainWindow.webContents.send("mc-fail");
            }
            logger.info("Assuming mc suceeded as fail did not get called");
            mainWindow.webContents.send("mc-ready");
        }).catch(y => {
            logger.warn("Prep mc all promise sent a reject message of ", y);
        });
        //check mc is ready
    });
    /*
    if (username) {
                
            } else {
                if (!result.ownsGame) return mainWindow.webContents.send("mc-fail", "not-own")
                launcher.launch(result).then(child => {
                    if (child == null) {
                        mainWindow.setAlwaysOnTop(winontop)
                        mainWindow.setSkipTaskbar(false)
                        mainWindow.show()
                        return mainWindow.webContents.send("mc-fail")

                    }
                    mainWindow.webContents.send("mc-start")
                    mainWindow.setAlwaysOnTop(false)
                    mainWindow.setSkipTaskbar(false)
                    mainWindow.hide()

                    child?.on("exit", () => {
                        logger.info("exit")
                        mainWindow.webContents.send("mc-close")
                        mainWindow.setAlwaysOnTop(winontop)
                        mainWindow.show()
                        mainWindow.focus()
                    })
                }).catch(x => {
                    mainWindow.webContents.send("mc-fail", x)
                })
    */
    electron_1.ipcMain.handle("launch-mc", () => {
        if (authstate.state == 0) {
            logger.warn("MC launch attempted state is still 0 telling client to ready");
            return mainWindow.webContents.send("ready");
        }
        try {
            //check if online or not
            if (authstate.online == 0) {
                //offline
                return launcher.launchgmllNoAuth({
                    username: authstate.username
                });
                /*.then(child => {
                                    if (child == null) {
                                        mainWindow.setAlwaysOnTop(winontop)
                                        mainWindow.setSkipTaskbar(false)
                                        mainWindow.show()
                                        return mainWindow.webContents.send("mc-fail")

                                    }
                                    mainWindow.webContents.send("mc-start")
                                    mainWindow.setAlwaysOnTop(false)
                                    mainWindow.setSkipTaskbar(false)
                                    mainWindow.hide()

                                    child?.on("exit", () => {
                                        logger.info("exit")
                                        mainWindow.webContents.send("mc-close")
                                        mainWindow.setAlwaysOnTop(winontop)
                                        mainWindow.show()
                                        mainWindow.focus()
                                    })
                                }).catch(x => {
                                    mainWindow.webContents.send("mc-fail", x)

                                })*/
            }
            else {
                //online
                if (authstate.state == 1) {
                    logger.warn("state is 1. cant run mc. making client ready");
                    mainWindow.webContents.send("ready");
                    return;
                }
                if (authstate.result.ownsGame == false) {
                    logger.warn("Owns game is false! Telling client.");
                    mainWindow.webContents.send("mc-fail", "not-own");
                    return;
                }
                authstate.result;
                return launcher.launchgmll({
                    username: authstate.result.username,
                    access_token: authstate.result.access_token,
                    uuid: authstate.result.uuid
                });
                /*.then(child => {
                                    if (child == null) {
                                        mainWindow.setAlwaysOnTop(winontop)
                                        mainWindow.setSkipTaskbar(false)
                                        mainWindow.show()
                                        return mainWindow.webContents.send("mc-fail")

                                    }
                                    mainWindow.webContents.send("mc-start")
                                    mainWindow.setAlwaysOnTop(false)
                                    mainWindow.setSkipTaskbar(false)
                                    mainWindow.hide()

                                    child?.on("exit", () => {
                                        logger.info("exit")
                                        mainWindow.webContents.send("mc-close")
                                        mainWindow.setAlwaysOnTop(winontop)
                                        mainWindow.show()
                                        mainWindow.focus()
                                    })
                                }).catch(x => {
                                    mainWindow.webContents.send("mc-fail", x)

                                })*/
            }
        }
        catch (e) {
            logger.warn("launch mc failed with error " + e);
            mainWindow.webContents.send("error", e);
        }
    });
    electron_1.ipcMain.handle("window-hide", () => {
        logger.info("User initiated window hide");
        try {
            winontop = false;
            mainWindow.setAlwaysOnTop(false);
            mainWindow.setSkipTaskbar(false);
            mainWindow.minimize();
        }
        catch (e) {
            logger.warn("window hide failed with error " + e);
            mainWindow.webContents.send("error", e);
        }
    });
    electron_1.ipcMain.handle("has-token", () => {
        logger.info("token check");
        //logger.info(stripData(memorystate))
        logger.info(memorystate);
        try {
            if (authstate.state == 0)
                return mainWindow.webContents.send("has-token-res", {
                    auth: {
                        online: authstate.online,
                        state: 0
                    },
                    status: mcready.value,
                    memory: (0, index_types_1.stripData)(memorystate)
                });
            if (authstate.online == 0) {
                return mainWindow.webContents.send("has-token-res", {
                    auth: {
                        online: authstate.online,
                        state: authstate.online,
                        username: !!authstate.username
                    },
                    status: mcready.value,
                    memory: (0, index_types_1.stripData)(memorystate)
                });
            }
            else {
                if (authstate.state == 1) {
                    return mainWindow.webContents.send("has-token-res", {
                        auth: {
                            online: authstate.online,
                            state: authstate.online,
                            code: !!authstate.code
                        },
                        status: mcready.value,
                        memory: (0, index_types_1.stripData)(memorystate)
                    });
                }
                else {
                    return mainWindow.webContents.send("has-token-res", {
                        auth: {
                            online: authstate.online,
                            state: authstate.online,
                            code: !!authstate.code,
                            result: !!authstate.result
                        },
                        status: mcready.value,
                        memory: (0, index_types_1.stripData)(memorystate)
                    });
                }
            }
        }
        catch (e) {
            logger.warn("token check failed with error " + e);
            mainWindow.webContents.send("error", e);
        }
    });
    electron_1.ipcMain.handle("auth-run", () => {
        logger.info("authrun recieved");
        try {
            authWindow(mainWindow, true);
        }
        catch (e) {
            logger.warn("auth run failed with error " + e);
            mainWindow.webContents.send("error", e);
        }
    });
    electron_1.ipcMain.handle("proc-begin", () => {
        logger.info("User sent begin process. Showing window!");
        try {
            mainWindow.show();
            if (!memorystate)
                logger.debug("No memory. Let's hope this is right");
            else {
                const data = TokenCheckResponse(memorystate);
                logger.debug(data);
                return mainWindow.webContents.send("proc-done", data);
            }
            startProceses().then(() => {
                const data = TokenCheckResponse(memorystate);
                logger.debug(data);
                mainWindow.webContents.send("proc-done", data);
            }).catch((e) => {
                logger.warn("proc begin start proc catch got error " + e);
                mainWindow.webContents.send("error");
            });
        }
        catch (e) {
            logger.warn("proc begin failed with error " + e);
            logger.error(e);
            mainWindow.webContents.send("error", e);
        }
    });
}
if (worker_threads_1.isMainThread) {
    logger.debug("Forge!");
    logger.debug(forge_1_19_2_43_2_0_jar_1.default);
    if (!electron_1.app) {
        logger.error("Electron does not exist somehow?");
        process.exit(1);
    }
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    electron_1.app.whenReady().then(() => {
        logger.info("Electron ready. Starting app.");
        appStart();
        electron_1.app.on('activate', () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (electron_1.BrowserWindow.getAllWindows().length === 0)
                appStart();
        });
        setInterval(() => {
            (0, util_1.checkWifi)().then(x => {
                //logger.info(x.net.socket)
                if (window.isDestroyed())
                    return;
                window === null || window === void 0 ? void 0 : window.webContents.send("wifi", x.wifi || x.err);
            });
        }, 2500);
    });
    /*
    process.stdout._write = (buf) => {
        logger.log("debug", String(buf))
    }

    process.stderr._write = (buf) => {
        logger.log("debug", String(buf))
        if (String(buf).includes("Error occurred in handler for")) window.webContents.send("error", String(buf))
    }

    */
    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    electron_1.app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
            logger.info("Application has quit. Stopping backend.");
        }
    });
}
else {
    const data = worker_threads_1.workerData;
    if (!data) {
        console.log("No data!");
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage("thre-fail no-data");
        process.exit(1);
    }
    if (data.task == "auth-handle") {
        const code = data.data;
        if (!code) {
            console.log("No code!");
            worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage("auth-fail no-code");
            process.exit(1);
        }
        console.log('Auth handler');
        (0, auth_1.fastAuth)(code, (update) => {
            worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage("auth-upda " + JSON.stringify(update));
        }).then(x => {
            worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage("auth-succ " + JSON.stringify(x));
        }).catch(y => {
            worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage("auth-fail " + y);
        });
    }
    else if (data.task == "mc-prep") {
        (0, config_1.setRoot)(".MC");
        gmll.init().then(() => {
            worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage('mc-upda init-pass');
            new gmll.Instance({
                version: "1.19.2"
            }).install().then(() => {
                worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage('mc-upda inst-pass');
                worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage('mc-succ inst-pass');
                process.exit(0);
            }).catch(z => {
                worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage('mc-upda inst-fail ' + z);
                worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage('mc-fail inst-fail ' + z);
                process.exit(1);
            });
        }).catch(y => {
            worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage('mc-upda init-fail ' + y);
            worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage('mc-fail init-fail ' + y);
            process.exit(1);
        });
    }
    else if (data.task == "image-save") {
        const img = data.data;
        let i = 0;
        if (data.increment) {
            i = fs.readdirSync(".").filter((x) => x.endsWith("sharkimg.png")).length;
        }
        else {
            i = 0;
        }
        fs.writeFileSync(`${i}sharkimg.png`, img);
    }
    else if (data.task == "log-get") {
        //get logs
        try {
            //get paths
            const appdata = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
            const zipdir = path_1.default.join(appdata, "forge", "logs");
            const zippath = path_1.default.join(zipdir, "report.zip");
            worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage("zip-upda " + zipdir + " " + zippath);
            //create archive to store files
            const archive = new adm_zip_1.default();
            //zip the whole folder for simplicity
            archive.addLocalFolder(zipdir);
            //save the archive
            archive.writeZip(zippath, (err) => {
                //done?
                if (err)
                    return worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage("zip-erro " + err);
                worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage("zip-done");
            });
        }
        catch (error) {
            worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage("zip-erro " + error);
        }
    }
    else {
        //determine state of auth
        if (data.data.online == 0) {
            //we're offline
        }
        else {
            //we're online
        }
    }
}
//# sourceMappingURL=index.js.map