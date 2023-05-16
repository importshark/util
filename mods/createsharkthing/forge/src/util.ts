import {
    getLogger
} from "./logger"
import {
    Worker
} from "worker_threads";

const [logger, worklogger] = [getLogger("app"), getLogger("workers")]


import * as fs from "fs"
import {
    writeFile,
    readFile,
    unlink
} from "fs/promises"
import {
    OwnsGameFastAuth
} from "./types/auth.types";
import {
    workerDataType
} from "./types/thread.types";






export interface MemoryAA {
    username: string,
    save: true
}
export interface MemoryAB {
    auth: {
        auth: OwnsGameFastAuth
    },
    save: true
}

export interface MemorySaveA {
    username: string
}
export interface MemorySaveB {
    auth: OwnsGameFastAuth
}

export interface MemorySaveC {

    save: false
}

interface MemoryB {

    save: false
}



interface MemoryParseA {
    auth: string,
    online: 0,
    state: 3
}

interface MemoryParseB {
    auth: OwnsGameFastAuth,
    online: 1,
    state: 3
}

interface MemoryParseC {

    state: 2
}

interface MemoryParseD {

    state: 1
}

interface MemoryParseE {

    state: 0
}



interface MemoryStripA {
    auth: boolean,
    username: string
    online: 0,
    state: 3
}
interface MemoryStripAB {
    auth: boolean,
    username: {
        username: string
    }
    online: 0,
    state: 3
}

interface MemoryStripB {
    auth: boolean,
    username: string,
    online: 1,
    state: 3
}

interface MemoryStripC {

    state: 2
}

interface MemoryStripD {

    state: 1
}

interface MemoryStripE {

    state: 0
}

export type Memory = MemoryAA | MemoryAB | MemoryB
export type ParsedMemory = MemoryParseA | MemoryParseB | MemoryParseC | MemoryParseD | MemoryParseE
export type StrippedMemory = MemoryStripA | MemoryStripB | MemoryStripC | MemoryStripD | MemoryStripE | MemoryStripAB
export type MemoryInput = MemorySaveA | MemorySaveB



/*
open("./logs", (err) => {
    console.log(err)
})
*/


export function getCode(url: string) {
    const index = url.indexOf("?")

    const newstring = url.substring(index)
    const search = new URLSearchParams(newstring)
    return search.get("code")
}





function encode(data: string): string {

    return Buffer.from(data).toString("base64")


}

function decode(data: string): string {
    return Buffer.from(data, "base64").toString()
}


export type ElectronLog = import("electron-log").ElectronLog


export function remember(data: MemoryInput, save ? : boolean) {
    return new Promise((resolve) => {
        try {
            let stringdata;
            if (!save && typeof save == "boolean") {
                stringdata = JSON.stringify({
                    save: false
                })
            } else {
                stringdata = JSON.stringify({
                    save: true,
                    auth: data
                })
            }
            logger.info("Saving data: " + stringdata)
            writeFile("./memory.save", encode(stringdata), {
                flag: "w"
            }).then(resolve).catch(y => {
                logger.error("Remember failed save because of error: ", y)
            })
        } catch (err) {
            logger.error("Remember error! ", err)
        }

    })

}

export function forget() {
    return new Promise((resolve) => {
        try {

            logger.info("Forgetting data...")
            unlink("./memory.save").then(() => {
                resolve(true)
            }).catch(y => {
                logger.error("Forget failed save because of error: ", y)
                resolve(false)
            })
        } catch (err) {
            logger.error("Forget error! ", err)
            resolve(false)
        }

    })

}

export function reminisce(): Promise < Memory | false > {
    return new Promise((resolve) => {
        if (!fs.existsSync("./memory.save")) return resolve(false)
        readFile("./memory.save").then(x => {
            try {
                const basestring = x.toString()
                const json = JSON.parse(decode(basestring))
                resolve( < Memory > json)
            } catch (e) {
                logger.error("Reminisce failed ", e)
            }

        }).catch(y => {
            logger.error("reminisce failed save because of error: ", y)
        })

    })
}



/*
setKeys({account: {access_token: "", expires_in: 0, msaccess_token: "", msrefesh_token: "", ownsGame: true, profile: {activeskin: {id: "", state: "ACTIVE", url: "", variant: "CLASSIC"}, capes: [{alias: "", id: "", state: "ACTIVE", url: ""}], id: "", name: "", profileActions: {}, skins: []}, username: "", uuid: ""}})
getKey()
*/
//teste(generateKey(), {account: {access_token: "", expires_in: 0, msaccess_token: "", msrefesh_token: "", ownsGame: true, profile: {activeskin: {id: "", state: "ACTIVE", url: "", variant: "CLASSIC"}, capes: [{alias: "", id: "", state: "ACTIVE", url: ""}], id: "", name: "", profileActions: {}, skins: []}, username: "", uuid: ""}})
interface ipobject {
    ip: number
}

interface WifiCheck {
    err ? : Error, wifi: boolean, ip ? : ipobject
}

export function checkWifi(): Promise < WifiCheck > {
    return new Promise((resolve) => {

        try {

            //const socket = fetch("https://api.ipify.org/?format=json");
            //logger.trace("Check wifi needs to be set for ipv4 host")
            resolve({
                wifi: true
            })

            setTimeout(resolve, 3000)
            /*socket.then((x) => {
                x.json().then((y: any) => {
                    resolve({
                        err: undefined,
                        ip: < ipobject > y,
                        wifi: true
                    })
                })
            })*/

        } catch (e) {
            logger.warn("Check wifi failed with error " + e)
            resolve({
                err: undefined,
                ip: undefined,
                wifi: false
            })
        }

    });

}

export function runThread(workerData: workerDataType): Worker {

    const worker = new Worker(__filename, {
        workerData
    })



    worker.stdout.on("data", (msg) => {
        worklogger.info(`Worker running task ${workerData.task} sent out message: ${String(msg).trim()}`)
    })
    worker.stderr.on("data", (msg) => {
        worklogger.info(`Worker running task ${workerData.task} sent err message: ${String(msg).trim()}`)
    })

    return worker;
}

//console.log(run())