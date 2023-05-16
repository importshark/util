import * as minecraft from "minecraft-launcher-core"
import {
    ChildProcessWithoutNullStreams
} from "child_process"

import {
    AuthInfo,
    NoAuthInfo
} from "./types/minecraft.types"
// /import forgefile from "./assets/other/forge-1.19.2-43.2.0.jar"
import {
    Instance,
    init
} from "gmll"
// eslint-disable-next-line import/no-unresolved
import {
    getEventListener,
    setRoot
    // eslint-disable-next-line import/no-unresolved
} from "gmll/config"
import {
    getLogger
} from "./logger"






const appdata = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")



const forge = ""
const forgefile = ""



const logger = Object.assign(console, getLogger("minecraft"))


setRoot(".MC")

export function launch(auth: AuthInfo): Promise < ChildProcessWithoutNullStreams | null > {

    return new Promise((resolve) => {
        logger.debug("launch ", forge, forgefile)
        const launcher = new minecraft.Client()
        launcher.on("data", x => {
            logger.debug("data")
            logger.debug(x)
        });
        launcher.on('debug', x => {
            logger.debug("debug")
            logger.debug(x)
        });
        launcher.on("close", x => {
            logger.debug("arcloseguments")
            logger.debug(x)
        });
        launcher.on('progress', x => {
            logger.debug("progress")
            logger.debug(x)
        });
        launcher.on('download-status', x => {
            logger.debug("download-status")
            logger.debug(x)
        });
        launcher.on("package-extract", x => {
            logger.debug("arguments")
            logger.debug(x)
        });
        launcher.on('arguments', x => {
            logger.debug("arguments")
            logger.debug(x)
        });
        launcher.on('download', x => {
            logger.debug("download")
            logger.debug(x)
        });



        launcher.launch({
            root: ".MC",
            forge,
            overrides: {
                detached: false
            },
            javaPath: "C:\\Program Files\\Zulu\\zulu-17\\bin\\java.exe",
            authorization: new Promise(x => {
                x({
                    access_token: auth.access_token,
                    client_token: "",
                    uuid: auth.uuid,
                    name: auth.username,
                    user_properties: []
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

    return new Promise((resolve) => {
        logger.debug("launch ", forge, forgefile)
        const launcher = new minecraft.Client()
        launcher.on("data", x => {
            logger.debug("data")
            logger.debug(x)
        });
        launcher.on('debug', x => {
            logger.debug("debug")
            logger.debug(x)
        });
        launcher.on("close", x => {
            logger.debug("arcloseguments")
            logger.debug(x)
        });
        launcher.on('progress', x => {
            logger.debug("progress")
            logger.debug(x)
        });
        launcher.on('download-status', x => {
            logger.debug("download-status")
            logger.debug(x)
        });
        launcher.on("package-extract", x => {
            logger.debug("arguments")
            logger.debug(x)
        });
        launcher.on('arguments', x => {
            logger.debug("arguments")
            logger.debug(x)
        });
        launcher.on('download', x => {
            logger.debug("download")
            logger.debug(x)
        });

        launcher.launch({
            root: ".MC",
            forge,
            overrides: {
                detached: false
            },
            javaPath: "C:\\Program Files\\Zulu\\zulu-17\\bin\\java.exe",
            authorization: new Promise(x => {
                x({
                    access_token: "",
                    client_token: "",
                    uuid: auth.uuid || "",
                    name: auth.username,
                    user_properties: []
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

export function launchgmll(auth: AuthInfo): Promise < void > {

    return new Promise((resolve) => {
        logger.debug("launch ", forge, forgefile)
        const listener = getEventListener()
        listener.on("download.start", () => {
            logger.debug("download.done")

        });
        listener.on("download.done", () => {
            logger.debug("download.done")

        });
        listener.on("encode.start", () => {
            logger.debug("download.start")

        });
        listener.on("encode.progress", x => {
            logger.debug("encode.progress")
            logger.debug(x)
        });
        listener.on("encode.done", () => {
            logger.debug("encode.done")

        });
        listener.on("download.progress", x => {
            logger.debug("download.progress")
            logger.debug(x)
        });
        listener.on("jvm.start", x => {
            logger.debug("jvmstart")
            logger.debug(x)
        });
        listener.on("jvm.stderr", x => {
            logger.debug("jvmerr")
            logger.debug(x)
        });
        listener.on("jvm.stdout", x => {
            logger.debug("jvmout")
            logger.debug(x)
        });
        listener.on("parser.done", x => {
            logger.debug("parser.done")
            logger.debug(x)
        });
        listener.on("parser.fail", x => {
            logger.debug("parser.fail")
            logger.debug(x)
        });
        listener.on("parser.progress", x => {
            logger.debug("parser.progress")
            logger.debug(x)
        });
        listener.on("parser.start", x => {
            logger.debug("parser.start")
            logger.debug(x)
        });
        listener.on("proxy.fail", x => {
            logger.debug("proxyfail")
            logger.debug(x)
        });
        listener.on("proxy.request", x => {
            logger.debug("proxyreq")
            logger.debug(x)
        });
        listener.on("proxy.skinURL", x => {
            logger.debug("proxyskin")
            logger.debug(x)
        });
        listener.on("proxy.skinURL.fail", x => {
            logger.debug("proxyskinfail")
            logger.debug(x)
        });
        listener.on("proxy.start", x => {
            logger.debug("proxystart")
            logger.debug(x)
        });

        init().then(() => {
            new Instance({
                version: "1.19.2"
            }).launch({
                access_token: auth.access_token,
                profile: {
                    id: auth.uuid,
                    name: auth.username
                }
            }).then(resolve)
        })

    })



}



export function launchgmllNoAuth(auth: NoAuthInfo): Promise < void > {

    return new Promise((resolve) => {
        logger.debug("launch ", forge, forgefile)
        const listener = getEventListener()
        listener.on("download.start", () => {
            logger.debug("download.done")

        });
        listener.on("download.done", () => {
            logger.debug("download.done")

        });
        listener.on("encode.start", () => {
            logger.debug("download.start")

        });
        listener.on("encode.progress", x => {
            logger.debug("encode.progress")
            logger.debug(x)
        });
        listener.on("encode.done", () => {
            logger.debug("encode.done")
        });
        listener.on("download.progress", x => {
            logger.debug("download.progress")
            logger.debug(x)
        });
        listener.on("jvm.start", x => {
            logger.debug("jvmstart")
            logger.debug(x)
        });
        listener.on("jvm.stderr", x => {
            logger.debug("jvmerr")
            logger.debug(x)
        });
        listener.on("jvm.stdout", x => {
            logger.debug("jvmout")
            logger.debug(x)
        });
        listener.on("parser.done", x => {
            logger.debug("parser.done")
            logger.debug(x)
        });
        listener.on("parser.fail", x => {
            logger.debug("parser.fail")
            logger.debug(x)
        });
        listener.on("parser.progress", x => {
            logger.debug("parser.progress")
            logger.debug(x)
        });
        listener.on("parser.start", x => {
            logger.debug("parser.start")
            logger.debug(x)
        });
        listener.on("proxy.fail", x => {
            logger.debug("proxyfail")
            logger.debug(x)
        });
        listener.on("proxy.request", x => {
            logger.debug("proxyreq")
            logger.debug(x)
        });
        listener.on("proxy.skinURL", x => {
            logger.debug("proxyskin")
            logger.debug(x)
        });
        listener.on("proxy.skinURL.fail", x => {
            logger.debug("proxyskinfail")
            logger.debug(x)
        });
        listener.on("proxy.start", x => {
            logger.debug("proxystart")
            logger.debug(x)
        });

        init().then(() => {
            new Instance({
                version: "1.19.2"
            }).launch({
                profile: {
                    id: auth.uuid || "",
                    name: auth.username
                }
            }).then(resolve)
        })


    })

}