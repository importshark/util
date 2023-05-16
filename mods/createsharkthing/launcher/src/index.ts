import fetch from "node-fetch"
import express from "express"
import {
    app as electron,
    BrowserWindow,
    ipcMain,
    ipcRenderer,
    screen
} from "electron"
import * as workers from "worker_threads"
import * as launcher from "./minecraft"
import * as assets from "./assetloader"
import {
    EventEmitter
} from "events"
import {
    getLink,
    fastAuth
} from "./auth"
import path from "path"
import {
    checkWifi
} from "./util"
import * as http from "http"
import {varlistener, threeenum} from "./types/index.types"
import { OwnsGameFastAuth, NotOwnsGameFastAuth } from "./types/auth.types"


const listener = new EventEmitter()

let srv: http.Server;
let code: string;
let result: OwnsGameFastAuth | NotOwnsGameFastAuth | Partial < NotOwnsGameFastAuth > ;
let procesesdone: varlistener<threeenum> = new varlistener(0)

const webapp = express()
webapp.set("views", "/assets/view")

webapp.get("/auth/redirect", (req, res) => {
    const code = < string > req.query.code
    if (typeof code == "undefined") {
        console.log("no code")
        res.redirect("/")
    }

    listener.emit("auth-finish", code)


})






function startProceses(): Promise < void > {

    procesesdone.set(1)
    const thread = new workers.Worker(path.resolve(__dirname, "thread.js"), {workerData: {task: "mc-prep"}})
    thread.addListener("exit", (code) => {
        console.log("Gmll finished " + code)
            procesesdone.set(2)
    })

    thread.addListener("message", (input) => {
        
        let message: string = input.toString();
        console.log(message)
        
    })
        
    return new Promise((resolve, reject) => {
        resolve()
        


    })


}


//Launch electron process


//everything else has to happen async on the main process


//Launch webserver:
//initialize it



let window: BrowserWindow;


let authhandleregistered: boolean = false;

let mainwinfocusloop: NodeJS.Timer;
let authwinfail: false | any = false;
let winontop: boolean = true;
let username: string;


//webapp starts auth

function authWindow(parent: BrowserWindow, show: boolean) {
    console.log("authstart")
    intializews()
    let widthratio = 600 / screen.getPrimaryDisplay().bounds.width
    let heightratio = 800 / screen.getPrimaryDisplay().bounds.height

    console.log()
    const authWin = new BrowserWindow({
        width: screen.getPrimaryDisplay().bounds.width * widthratio,
        height: screen.getPrimaryDisplay().bounds.height * heightratio,
        frame: false,
        x: parent.getPosition()[0],
        y: parent.getPosition()[1],
        resizable: false,
        movable: false,
        parent,
        show: false
    })



    authWin.on("ready-to-show", () => {
        if (authWin.isDestroyed()) return;
        authWin.show()
    })

    if (!show) {
        ipcMain.once("auth-show", () => {
            if (authWin.isDestroyed()) return;
            authWin.show()
        })
    }

    authWin.on("closed", () => {
        window.webContents.send("auth-close", authwinfail)
    })

    authWin.on("show", () => {
        window.webContents.send("auth-show")
    })

    listener.once("auth-finish", (authcode) => {

        code = authcode;
        if (authWin.isDestroyed()) return;
        authWin.close()
    })



    if (!authhandleregistered) {
        authhandleregistered = true;
        ipcMain.handleOnce("auth-handle", () => {
            authhandleregistered = false;
            fastAuth(code, (info) => {
                window.webContents.send("update", {
                    event: info.event,
                    progress: info.progress,
                    status: info.status

                })
            }).then(x => {
                result = x;
                window.webContents.send("auth-done")
            })
        })
    }





    authWin.loadURL(getLink()).catch(y => {
        console.log("authfail sent")
        authwinfail = y;
        if (authWin.isDestroyed()) return;
        authWin.close()
    })
}

function appStart() {

    let widthratio = 600 / screen.getPrimaryDisplay().bounds.width
    let heightratio = 800 / screen.getPrimaryDisplay().bounds.height

    const mainWindow = new BrowserWindow({
        width: screen.getPrimaryDisplay().bounds.width * widthratio,
        height: screen.getPrimaryDisplay().bounds.height * heightratio,
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
    })

    window = mainWindow;

    //mainWindow.setOpacity(.5)
    mainWindow.loadFile("./assets/html/index.html")


    //Process window triggers

    ipcMain.handle("window-close", (ev) => {

        mainWindow.close()
    })


    ipcMain.handle("prep-mc", (ev, arg) => {


        if (code || result) {
            //launch ready
            console.log("code or result")
            if(procesesdone.value == 0){
                startProceses().then(x => {
                    mainWindow.webContents.send("mc-ready")
                })
            }else if(procesesdone.value == 1){
                procesesdone.addListener((value, newvalue) => {
                    if(newvalue == 2){
                        mainWindow.webContents.send("mc-ready")
                    }
                })
            }else{
                mainWindow.webContents.send("mc-ready")
            }
        } else {
            if (arg) {
                //readyish
                console.log("Has username")
                username = arg;
                mainWindow.webContents.send("mc-ready")
            } else {
                console.log("Is not ready at all")
                mainWindow.webContents.send("ready")
            }
        }
    })

    ipcMain.handle("launch-mc", (ev, arg) => {
        console.log(username)
        console.log(result)
        if(!result && username){
            return launcher.launchNoAuth({username: username}).then(child => {
                mainWindow.webContents.send("mc-start")
                mainWindow.setAlwaysOnTop(false)
                mainWindow.setSkipTaskbar(false)
                mainWindow.hide()
    
                child?.on("exit", () => {
                    console.log("exit")
                    mainWindow.webContents.send("mc-close")
                    mainWindow.setAlwaysOnTop(winontop)
                    mainWindow.show()
                    mainWindow.focus()
                })
            }).catch(x => {
                mainWindow.webContents.send("mc-fail", x)
            })
        }else{
        if (!result.ownsGame) return mainWindow.webContents.send("mc-fail", "not-own")
        launcher.launch(result).then(child => {
            mainWindow.webContents.send("mc-start")
            mainWindow.setAlwaysOnTop(false)
            mainWindow.setSkipTaskbar(false)
            mainWindow.hide()

            child?.on("exit", () => {
                console.log("exit")
                mainWindow.webContents.send("mc-close")
                mainWindow.setAlwaysOnTop(winontop)
                mainWindow.show()
                mainWindow.focus()
            })
        }).catch(x => {
            mainWindow.webContents.send("mc-fail", x)
        })
    }
    })

    ipcMain.handle("start-show-loop", (ev) => {

        window.setAlwaysOnTop(true)
    })

    ipcMain.handle("stop-show-loop", (ev) => {

        if (!winontop) {
            window.setAlwaysOnTop(false)
        }
    })

    ipcMain.handle("window-hide", (ev) => {

        winontop = false;
        mainWindow.setAlwaysOnTop(false)
        mainWindow.setSkipTaskbar(false)
        mainWindow.hide()
    })

    ipcMain.handle("has-token", (ev) => {
        console.log(code, result)
        switch (procesesdone.value) {
            case 0:
                mainWindow.webContents.send("has-token-res", {
                    code: !!code,
                    token: !!result,
                    status: 0
                })
                break;

            case 1:
                mainWindow.webContents.send("has-token-res", {
                    code: !!code,
                    token: !!result,
                    status: 1
                })
                break;

            case 2:
                mainWindow.webContents.send("has-token-res", {
                    code: !!code,
                    token: !!result,
                    done: 2
                })
                break;
        }
        

    })

    ipcMain.handle("auth-begin", x => {
        //authWindow(mainWindow, false)
    })

    ipcMain.handle("auth-run", x => {
        console.log("authrun recieved")
        authWindow(mainWindow, true)
    })

    ipcMain.handle("proc-begin", () => {
        if(procesesdone.value > 0) return mainWindow.webContents.send("proc-done");
        startProceses().then(() => {
            mainWindow.webContents.send("proc-done")
        })
    })


}


function intializews() {

    if (srv) {
        srv.close()
    }
    try {
        srv = webapp.listen(3000, () => {
            console.log("ws ready")

        })

        listener.on("auth-finish", () => {
            srv.close()
        })
    } catch (e) {
        console.error(e)
        window.webContents.send("srv-fail", e)
    }


}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron.whenReady().then(() => {
    appStart()

    electron.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) appStart()
    })

    setInterval(() => {
        checkWifi().then(x => {
            if (window.isDestroyed()) return;
            window?.webContents.send("wifi", x)


        })
    }, 5000)

})





// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron.on('window-all-closed', () => {
    if (process.platform !== 'darwin') electron.quit()
})