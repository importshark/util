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
const express_1 = __importDefault(require("express"));
const electron_1 = require("electron");
const workers = __importStar(require("worker_threads"));
const launcher = __importStar(require("./minecraft"));
const assets = __importStar(require("./assetloader"));
const events_1 = require("events");
const auth_1 = require("./auth");
const path_1 = __importDefault(require("path"));
const util_1 = require("./util");
const index_types_1 = require("./types/index.types");
const listener = new events_1.EventEmitter();
let srv;
let code;
let result;
let procesesdone = new index_types_1.varlistener(0);
const webapp = (0, express_1.default)();
webapp.set("views", "/assets/view");
webapp.get("/auth/redirect", (req, res) => {
    const code = req.query.code;
    if (typeof code == "undefined") {
        console.log("no code");
        res.redirect("/");
    }
    listener.emit("auth-finish", code);
});
function startProceses() {
    procesesdone.set(1);
    const thread = new workers.Worker(path_1.default.resolve(__dirname, "thread.js"), { workerData: { task: "mc-prep" } });
    thread.addListener("exit", (code) => {
        console.log("Gmll finished " + code);
        procesesdone.set(2);
    });
    thread.addListener("message", (input) => {
        let message = input.toString();
        console.log(message);
    });
    return new Promise((resolve, reject) => {
        resolve();
    });
}
//Launch electron process
//everything else has to happen async on the main process
//Launch webserver:
//initialize it
let window;
let authhandleregistered = false;
let mainwinfocusloop;
let authwinfail = false;
let winontop = true;
let username;
//webapp starts auth
function authWindow(parent, show) {
    console.log("authstart");
    intializews();
    let widthratio = 600 / electron_1.screen.getPrimaryDisplay().bounds.width;
    let heightratio = 800 / electron_1.screen.getPrimaryDisplay().bounds.height;
    console.log();
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
    if (!show) {
        electron_1.ipcMain.once("auth-show", () => {
            if (authWin.isDestroyed())
                return;
            authWin.show();
        });
    }
    authWin.on("closed", () => {
        window.webContents.send("auth-close", authwinfail);
    });
    authWin.on("show", () => {
        window.webContents.send("auth-show");
    });
    listener.once("auth-finish", (authcode) => {
        code = authcode;
        if (authWin.isDestroyed())
            return;
        authWin.close();
    });
    if (!authhandleregistered) {
        authhandleregistered = true;
        electron_1.ipcMain.handleOnce("auth-handle", () => {
            authhandleregistered = false;
            (0, auth_1.fastAuth)(code, (info) => {
                window.webContents.send("update", {
                    event: info.event,
                    progress: info.progress,
                    status: info.status
                });
            }).then(x => {
                result = x;
                window.webContents.send("auth-done");
            });
        });
    }
    authWin.loadURL((0, auth_1.getLink)()).catch(y => {
        console.log("authfail sent");
        authwinfail = y;
        if (authWin.isDestroyed())
            return;
        authWin.close();
    });
}
function appStart() {
    let widthratio = 600 / electron_1.screen.getPrimaryDisplay().bounds.width;
    let heightratio = 800 / electron_1.screen.getPrimaryDisplay().bounds.height;
    const mainWindow = new electron_1.BrowserWindow({
        width: electron_1.screen.getPrimaryDisplay().bounds.width * widthratio,
        height: electron_1.screen.getPrimaryDisplay().bounds.height * heightratio,
        frame: true,
        alwaysOnTop: true,
        closable: true,
        center: true,
        hasShadow: false,
        skipTaskbar: false,
        webPreferences: {
            preload: assets.getPath("preload.js", "js"),
            nodeIntegration: true
        }
    });
    window = mainWindow;
    //mainWindow.setOpacity(.5)
    mainWindow.loadFile("./assets/html/index.html");
    //Process window triggers
    electron_1.ipcMain.handle("window-close", (ev) => {
        mainWindow.close();
    });
    electron_1.ipcMain.handle("prep-mc", (ev, arg) => {
        if (code || result) {
            //launch ready
            console.log("code or result");
            if (procesesdone.value == 0) {
                startProceses().then(x => {
                    mainWindow.webContents.send("mc-ready");
                });
            }
            else if (procesesdone.value == 1) {
                procesesdone.addListener((value, newvalue) => {
                    if (newvalue == 2) {
                        mainWindow.webContents.send("mc-ready");
                    }
                });
            }
            else {
                mainWindow.webContents.send("mc-ready");
            }
        }
        else {
            if (arg) {
                //readyish
                console.log("Has username");
                username = arg;
                mainWindow.webContents.send("mc-ready");
            }
            else {
                console.log("Is not ready at all");
                mainWindow.webContents.send("ready");
            }
        }
    });
    electron_1.ipcMain.handle("launch-mc", (ev, arg) => {
        console.log(username);
        console.log(result);
        if (!result && username) {
            return launcher.launchNoAuth({ username: username }).then(child => {
                mainWindow.webContents.send("mc-start");
                mainWindow.setAlwaysOnTop(false);
                mainWindow.setSkipTaskbar(false);
                mainWindow.hide();
                child?.on("exit", () => {
                    console.log("exit");
                    mainWindow.webContents.send("mc-close");
                    mainWindow.setAlwaysOnTop(winontop);
                    mainWindow.show();
                    mainWindow.focus();
                });
            }).catch(x => {
                mainWindow.webContents.send("mc-fail", x);
            });
        }
        else {
            if (!result.ownsGame)
                return mainWindow.webContents.send("mc-fail", "not-own");
            launcher.launch(result).then(child => {
                mainWindow.webContents.send("mc-start");
                mainWindow.setAlwaysOnTop(false);
                mainWindow.setSkipTaskbar(false);
                mainWindow.hide();
                child?.on("exit", () => {
                    console.log("exit");
                    mainWindow.webContents.send("mc-close");
                    mainWindow.setAlwaysOnTop(winontop);
                    mainWindow.show();
                    mainWindow.focus();
                });
            }).catch(x => {
                mainWindow.webContents.send("mc-fail", x);
            });
        }
    });
    electron_1.ipcMain.handle("start-show-loop", (ev) => {
        window.setAlwaysOnTop(true);
    });
    electron_1.ipcMain.handle("stop-show-loop", (ev) => {
        if (!winontop) {
            window.setAlwaysOnTop(false);
        }
    });
    electron_1.ipcMain.handle("window-hide", (ev) => {
        winontop = false;
        mainWindow.setAlwaysOnTop(false);
        mainWindow.setSkipTaskbar(false);
        mainWindow.hide();
    });
    electron_1.ipcMain.handle("has-token", (ev) => {
        console.log(code, result);
        switch (procesesdone.value) {
            case 0:
                mainWindow.webContents.send("has-token-res", {
                    code: !!code,
                    token: !!result,
                    status: 0
                });
                break;
            case 1:
                mainWindow.webContents.send("has-token-res", {
                    code: !!code,
                    token: !!result,
                    status: 1
                });
                break;
            case 2:
                mainWindow.webContents.send("has-token-res", {
                    code: !!code,
                    token: !!result,
                    done: 2
                });
                break;
        }
    });
    electron_1.ipcMain.handle("auth-begin", x => {
        //authWindow(mainWindow, false)
    });
    electron_1.ipcMain.handle("auth-run", x => {
        console.log("authrun recieved");
        authWindow(mainWindow, true);
    });
    electron_1.ipcMain.handle("proc-begin", () => {
        if (procesesdone.value > 0)
            return mainWindow.webContents.send("proc-done");
        startProceses().then(() => {
            mainWindow.webContents.send("proc-done");
        });
    });
}
function intializews() {
    if (srv) {
        srv.close();
    }
    try {
        srv = webapp.listen(3000, () => {
            console.log("ws ready");
        });
        listener.on("auth-finish", () => {
            srv.close();
        });
    }
    catch (e) {
        console.error(e);
        window.webContents.send("srv-fail", e);
    }
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.whenReady().then(() => {
    appStart();
    electron_1.app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            appStart();
    });
    setInterval(() => {
        (0, util_1.checkWifi)().then(x => {
            if (window.isDestroyed())
                return;
            window?.webContents.send("wifi", x);
        });
    }, 2500);
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
