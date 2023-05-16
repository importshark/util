import http from "https"
import zip from "adm-zip"
import * as fs from "fs"
import {app, BrowserWindow, ipcMain} from "electron"

const createWindow = () => {


    const mainWindow = new BrowserWindow({
        width: 500,
        height: 700,
        frame: false,
        alwaysOnTop: false,
        closable: false,
        center: true,
        transparent: true,
        resizable: false,
        hasShadow: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.loadFile('assets/index.html')
    ipcMain.handle("window", () => {
        mainWindow.setAlwaysOnTop(false)
    })

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


  
/*
let downloads = {

}


function download(url: string, dest: fs.PathLike): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest, { flags: "wx" });

        const request = http.get(url, response => {
            if (response.statusCode === 200) {
                response.pipe(file);
            } else {
                file.close();
                fs.unlink(dest, () => {}); // Delete temp file
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            }
        });

        request.on("error", err => {
            file.close();
            fs.unlink(dest, () => {}); // Delete temp file
            reject(err.message);
        });

        file.on("finish", () => {
            resolve();
        });

        file.on("error", err => {
            file.close();

            
        });
    });
}
//await download()*/