import * as http from "https"
import {
    resolve
} from "path"
import * as fs from "fs"
import AdmZip from "adm-zip"



if (process.platform != "win32" && process.platform != "darwin") throw new Error("Must be run on Windows or Mac!")



let downloads = {
    "win32": {
        url: "https://download.oracle.com/java/17/archive/jdk-17.0.6_windows-x64_bin.zip",
        file: "jdk-17.0.6_windows-x64_bin.zip"
    },
    "darwin": {
        url: "https://download.oracle.com/java/17/archive/jdk-17.0.6_macos-x64_bin.tar.gz",
        file: "jdk-17.0.6_macos-x64_bin.tar.gz"
    }
}

if (process.platform != "win32" && process.platform != "darwin") throw new Error("Must be run on Win or Mac");
let {
    url,
    file
} = downloads[process.platform]


function download(url: string, dest: fs.PathLike): Promise < boolean > {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest, {
            flags: "wx"
        });

        const request = http.get(url, response => {
            if (response.statusCode === 200) {
                response.pipe(file);
            } else {
                file.close();
                fs.unlink(dest, () => {}); // Delete temp file
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            }
        });

        request.on("error", err => {
            console.log("death")
            console.log(err)
            file.close();
            fs.unlink(dest, () => {}); // Delete temp file
            reject(err);
        });



        request.on("information", (info) => {
            console.log(info)
        })
        request.on("response", (res) => {
            res.on("data", (chunk) => {
                console.log(chunk.toString())
            })

        })

        request.on("close", () => {
            console.log("maybe oh noes idk")
            resolve(true)
        })

        request.on("timeout", () => {
            console.log("Oh noes")
            reject()
        })

        file.on("finish", () => {
            resolve(true);
        });

        file.on("error", err => {
            file.close();


        });
    });
}

let i = 0;
let max = 3;

function downloadWrapper(url: string, dest: fs.PathLike) {
    return new Promise((resolve, reject) => {
        download(url, dest).then(async (x) => {
            if (!fs.existsSync(`./java/${file}`)) {
                i++;
                if (i >= 3) {
                    console.log("Download failed final time! Exiting.")
                    reject()
                }
                console.log(`Download failed! Retrying ${i} / ${max}.`)
                resolve(await downloadWrapper(url, dest))
            } else {
                resolve(x)
            }

        }).catch(async (y) => {
            i++;
            if (i >= 3) {
                console.log("Download failed final time! Exiting.")
                reject()
            }
            console.log(`Download failed! Retrying ${i} / ${max}.`)
            resolve(await downloadWrapper(url, dest))
            console.log("y " + y.code)
            reject(y)
        })
    });
}
/*
export default async function run() {

    await download(url, resolve(__dirname, `./java/${file}`)).then(x => {
        console.log("x " + x)
        let zip = new AdmZip(`./java/${file}`)
        zip.extractAllTo(`./java/`)

        fs.rmSync(`./java/${file}`)
    }).catch(y => {
        console.log("y " + y.code)
    })




}

run()*/