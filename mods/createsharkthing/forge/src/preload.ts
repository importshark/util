import {
    contextBridge,
    ipcRenderer
} from 'electron'
import {
    electron
} from "./types/api.types"





const electronapi: electron = {
    emit: (event: string, args ? : string) => {
        ipcRenderer.invoke(event, args)
    },
    handle: (event: string, handler: (data: unknown) => unknown) => {
        ipcRenderer.on(event, (ev, data) => {
            handler(data)
        })
    },
    handleOnce: (event: string, handler: (data: unknown) => unknown) => {
        ipcRenderer.once(event, (ev, data) => {
            handler(data)
        })
    }
}



console.log("Exposing api through context bridge")
contextBridge.exposeInMainWorld('electronAPI', electronapi)



console.log("Preload finished setup!")