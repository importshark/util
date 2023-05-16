const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    emit: (event, args) => ipcRenderer.invoke(event, args),
    handle: (event, handler) => ipcRenderer.on(event, (ev, data) => {handler(data)}),
    handleOnce: (event, handler) => ipcRenderer.once(event, (ev, data) => {handler(data)})
})

