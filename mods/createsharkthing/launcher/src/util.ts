import {
    promisified as regedit
} from "regedit"
import deasync from "deasync"
import * as https from "https"
import { OwnsGameFastAuth } from "./types/auth.types"
import {
    scrypt,
    randomBytes,
    createCipheriv,
    createDecipheriv,
    Decipher
  } from 'crypto';
import * as fs from "fs"


const rootkeys = ["HKLM", "HKCU"]
const browsers = ["chrome.exe", "vivaldi.exe", "brave.exe", "blisk.exe", "msedge.exe"]

interface Browesrs {
    [key: string]: string
}

const found: Browesrs = {}




function test(path: string): Promise < string | false > {

    return new Promise((resolve, reject) => {

        regedit.list([path]).then((value) => {
            let data = value[path]

            if (!data.exists) resolve(false)
            if (!data.values["Path"]) resolve(false)


            resolve(data.values["Path"]?.value.toString())

        }).catch(x => {
            console.log("error!")
            console.log(x)
            reject(x)
        })

    })

}

function testwrap(path: string): string | false {
    let value: string | false = false;
    let done = false;


    test(path).then((ret) => {
        value = ret;
        done = true;
    }).catch(x => {
        console.log("e ")
        console.log(x)
    })
    while (!done) {
        deasync.sleep(100)
    }

    return value;

}


function run() {

    for (let i = 0; i < rootkeys.length; i++) {
        const root = rootkeys[i];

        for (let j = 0; j < browsers.length; j++) {
            const browserkey = browsers[j];

            const path = `${root}\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\${browserkey}`
            let val = testwrap(path)
            if (val) {
                found[browserkey] = val
            }
            //console.log(path)

        }

    }

    for (let j = 0; j < browsers.length; j++) {
        const element = browsers[j];
        if (found[element]) {
            return {
                browser: found[element],
                app: element
            }
        }

    }
}

interface File{
    account: OwnsGameFastAuth
}

function generateKey(){
    return randomBytes(16).toString("hex")
}

function teste(key: string, file: File){


const algorithm = "aes-256-cbc";

// generate 16 bytes of random data
const initVector = randomBytes(16);

// protected data
const message = JSON.stringify(file);

// secret key generate 32 bytes of random data
const Securitykey = key

// the cipher function
const cipher = createCipheriv(algorithm, Securitykey, initVector);

// encrypt the message
// input encoding
// output encoding
let encryptedData = cipher.update(message, "utf-8", "hex");

encryptedData += cipher.final("hex");

console.log("Encrypted message: " + encryptedData);

// the decipher function
const decipher = createDecipheriv(algorithm, Securitykey, initVector);


let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

decryptedData += decipher.final("utf8");

console.log("Decrypted message: ");
console.log(JSON.parse(decryptedData))
}


export function getKey(){
     
    const algorithm = 'aes-192-cbc';
const password = 'assword used to generate key';
// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
// Use the async `crypto.scrypt()` instead.
scrypt(password, 'sat', 24, (err, key) => {
    if (err) throw err;

  
      // Once we have the key and iv, we can create and use the cipher...
      const cipher = createDecipheriv(algorithm, key, Buffer.alloc(16, 0));
  
      let encrypted = '';
      cipher.setEncoding('hex');
  
      cipher.on('data', (chunk) => encrypted += chunk.toString("utf-8"));
      cipher.on('end', () => console.log(encrypted));
  
      cipher.write(fs.readFileSync("./data.dump").toString(), "hex");
      cipher.end();
    
  });
}

export function setKeys(file: File){
    
      
      const algorithm = 'aes-192-cbc';
      const password = 'assword used to generate key';
      
      // First, we'll generate the key. The key length is dependent on the algorithm.
      // In this case for aes192, it is 24 bytes (192 bits).    
      scrypt(password, 'sat', 24, (err, key) => {
        if (err) throw err;
        // Then, we'll generate a random initialization randomFill(new Uint8Array(16), (err, iv) => {
          if (err) throw err;
      
          // Once we have the key and iv, we can create and use the cipher...
          const cipher = createCipheriv(algorithm, key, Buffer.alloc(16, 0));
      
          let encrypted = '';
          cipher.setEncoding('hex');
      
          cipher.on('data', (chunk) => encrypted += chunk);
          cipher.on('end', () => fs.writeFileSync("./data.dump", encrypted));
      
          cipher.write("some clear text data");
          cipher.end();
        
      });
    
}
/*
setKeys({account: {access_token: "", expires_in: 0, msaccess_token: "", msrefesh_token: "", ownsGame: true, profile: {activeskin: {id: "", state: "ACTIVE", url: "", variant: "CLASSIC"}, capes: [{alias: "", id: "", state: "ACTIVE", url: ""}], id: "", name: "", profileActions: {}, skins: []}, username: "", uuid: ""}})
getKey()
*/
teste(generateKey(), {account: {access_token: "", expires_in: 0, msaccess_token: "", msrefesh_token: "", ownsGame: true, profile: {activeskin: {id: "", state: "ACTIVE", url: "", variant: "CLASSIC"}, capes: [{alias: "", id: "", state: "ACTIVE", url: ""}], id: "", name: "", profileActions: {}, skins: []}, username: "", uuid: ""}})


export function checkWifi() {
    return new Promise((resolve, reject) => {
        //resolve(true)
        const socket = https.request("https://google.com");
        socket.setTimeout(3000);
        socket.on('connect', () => {
            socket.end();
            resolve(true);
        });
        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });
        socket.on('error', (e) => {
            console.log(e.message)
            socket.destroy();
            resolve(e);
        });
    });

}



//console.log(run())

export {
    run as get
}
