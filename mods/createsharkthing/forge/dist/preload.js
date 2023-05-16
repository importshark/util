"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electronapi = {
    emit: (event, args) => {
        electron_1.ipcRenderer.invoke(event, args);
    },
    handle: (event, handler) => {
        electron_1.ipcRenderer.on(event, (ev, data) => {
            handler(data);
        });
    },
    handleOnce: (event, handler) => {
        electron_1.ipcRenderer.once(event, (ev, data) => {
            handler(data);
        });
    }
};
console.log("Exposing api through context bridge");
electron_1.contextBridge.exposeInMainWorld('electronAPI', electronapi);
console.log("Preload finished setup!");
//# sourceMappingURL=preload.js.map