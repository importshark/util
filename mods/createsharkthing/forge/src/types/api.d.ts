import {
    electron,
    consoletype
} from "./api.types"

type electronType = typeof apis.electron;
type consoleType = typeof apis.console;

declare global {
    interface Window {
        electronAPI: electron,
        //consoleAPI: console,
        ready: () => any,
        updateStatus: (newstate: string, readystate: boolean, customdata ? : partialstate) => any,
        getAvatar: (username: AvatarObject) => any,
        test: (test: string) => void,
        setImage: any
    }
}