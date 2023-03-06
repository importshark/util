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
const electron_1 = require("electron");
const path = __importStar(require("path"));
const createWindow = () => {
    let widthratio = electron_1.screen.getPrimaryDisplay().bounds.width / 500;
    let heightratio = electron_1.screen.getPrimaryDisplay().bounds.height / 700;
    // Create the browser window.
    const mainWindow = new electron_1.BrowserWindow({
        width: electron_1.screen.getPrimaryDisplay().bounds.width / widthratio,
        height: electron_1.screen.getPrimaryDisplay().bounds.height / heightratio,
        frame: true,
        alwaysOnTop: false,
        closable: true,
        center: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    });
    //mainWindow.setAlwaysOnTop(false)
    // and load the index.html of the app.
    mainWindow.loadFile('assets/index.html');
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
//const app = express()
/*



let skin = profileData.skins.find(x => x.state == "ACTIVE")
if(skin){
await setTexture({
    accessToken: last.access_token,
    uuid: profileData.id,
    type: "skin",
    texture: {
        url: skin.url,
        metadata: { model: (skin.variant == "SLIM") ? "slim" : "steve"}
    }
});
}


//mc.launch()*/ 
