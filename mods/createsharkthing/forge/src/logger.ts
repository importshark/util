import electronlogger from "electron-log"
import path from "path"

type systems = "app" | "workers" | "renderer" | "minecraft"

export function getLogger(system: systems) {
    const log = electronlogger.create(system)
    //disable console transport for render logger
    if (system == "renderer") {
        log.transports.console.level = false
    }
    log.catchErrors({
        onError: () => false,
        showDialog: false
    })


    return log;
}