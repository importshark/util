import * as minecraft from "minecraft-launcher-core"
import {ChildProcessWithoutNullStreams} from "child_process"
import {join} from "path"



let appdata = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")

function getMSA(){

}

function checkWifi(){

}

function launch(): Promise<ChildProcessWithoutNullStreams | null>{

    return new Promise((resolve, reject) => {
        let launcher = new minecraft.Client()
        launcher.on("data", console.log)
        launcher.on('debug', console.log);

        launcher.launch({
            root: "./cache/minecraft",
            javaPath: "C:\\Program Files\\Zulu\\zulu-17\\bin\\java.exe",
            authorization: new Promise(x => {
                x({ 
                    access_token: "eyJraWQiOiJhYzg0YSIsImFsZyI6IkhTMjU2In0.eyJ4dWlkIjoiMjUzNTQ2NjY0Njc1NzI1NyIsImFnZyI6IkFkdWx0Iiwic3ViIjoiODE0NjM3MDctYzI4Ni00NDQwLWExODktZDM4M2ZjZDliMTk0IiwiYXV0aCI6IlhCT1giLCJucyI6ImRlZmF1bHQiLCJyb2xlcyI6W10sImlzcyI6ImF1dGhlbnRpY2F0aW9uIiwicGxhdGZvcm0iOiJVTktOT1dOIiwieXVpZCI6ImFmZjcwZjRmZDc1NTcxM2EwYjc3YTJiMGQ1ZDRjZTYxIiwibmJmIjoxNjc3ODg5MzMxLCJleHAiOjE2Nzc5NzU3MzEsImlhdCI6MTY3Nzg4OTMzMX0.NhCl601EtLpmQzm-foznHclm1890kCyjLGjAYBk_QPA",
                    client_token: "",
                    uuid: "11178be5ebed45dfa473d770fd085c6d",
                    name: "ASharkInTheVoid"
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

launch().then(x => {
    x?.stdout.on("data", (chunk) => {
        console.log(chunk.toString())
    })
    x?.stderr.on("data", (chunk) => {
        console.log(chunk.toString())
    })
})