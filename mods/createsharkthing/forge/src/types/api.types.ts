
type electrontype = {
    emit: (event: string, args ? : string) => void,
    handle: (event: string, handler: (data: unknown) => unknown) => void,
    handleOnce: (event: string, handler: (data: unknown) => unknown) => void
}

type consoletype = {
    console: import("../util").ElectronLog
}
    

export {electrontype as electron}
