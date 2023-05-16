import { AuthObject, FinishedOnlineAuthObject, OfflineAuthObject } from "./index.types"

export type Task = "mc-prep" 


interface workerDataAuthHandle {
    task: "auth-handle",
    data: string
}

interface workerDataMcPrep {
    task: "mc-prep"
}

interface workerDataMcLaunch {
    task: "mc-launch",
    data: FinishedOnlineAuthObject | OfflineAuthObject
}

interface workerDataImageSave {
    task: "image-save",
    increment: boolean,
    data: Buffer
}

interface workerDataGetLog {
    task: "log-get"
}

export type workerDataType = workerDataAuthHandle | workerDataMcPrep | workerDataImageSave | workerDataGetLog | workerDataMcLaunch;