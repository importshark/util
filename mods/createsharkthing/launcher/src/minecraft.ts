import * as minecraft from "minecraft-launcher-core"
import {
    ChildProcessWithoutNullStreams
} from "child_process"
import net from 'net';
import {
    join
} from "path"
import {
    getPath
} from "./assetloader"

import {AuthInfo, NoAuthInfo} from "./types/minecraft.types"






let appdata = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")

function getMSA() {

}








export function launch(auth: AuthInfo): Promise < ChildProcessWithoutNullStreams | null > {

    return new Promise((resolve, reject) => {
        let launcher = new minecraft.Client()
        launcher.on("data", console.log)
        launcher.on('debug', console.log);

        launcher.launch({
            root: join(__dirname, ".MC"),
            forge: getPath("forge-1.19.2-43.2.0.jar", "other"),
            overrides: {
                detached: false
            },
            javaPath: "C:\\Program Files\\Zulu\\zulu-17\\bin\\java.exe",
            authorization: new Promise(x => {
                x({
                    access_token: auth.access_token,
                    client_token: "",
                    uuid: auth.uuid,
                    name: auth.username
                })
            }),
            version: {
                number: "1.19.2",
                type: "release"
            },
            memory: {
                min: 2000,
                max: 4000
            }
        }).then(child => {
            resolve(child)
        })
    })



}



export function launchNoAuth(auth: NoAuthInfo): Promise < ChildProcessWithoutNullStreams | null > {

    return new Promise((resolve, reject) => {
        let launcher = new minecraft.Client()
        launcher.on("data", console.log)
        launcher.on('debug', console.log);

        launcher.launch({
            root: join(__dirname, ".MC"),
            forge: getPath("forge-1.19.2-43.2.0.jar", "other"),
            overrides: {
                detached: false
            },
            javaPath: "C:\\Program Files\\Zulu\\zulu-17\\bin\\java.exe",
            authorization: new Promise(x => {
                x({
                    access_token: "",
                    client_token: "",
                    uuid: auth.uuid || "",
                    name: auth.username
                })
            }),
            version: {
                number: "1.19.2",
                type: "release"
            },
            memory: {
                min: 2000,
                max: 4000
            }
        }).then(child => {
            resolve(child)
        })
    })



}
/*
launch({
    token: "",
    name: "ASharkInTheVoid",
    uuid: ""
}).then(x => {
    x?.stdout.on("data", (chunk) => {
        console.log(chunk.toString())
    })
    x?.stderr.on("data", (chunk) => {
        console.log(chunk.toString())
    })
})*/