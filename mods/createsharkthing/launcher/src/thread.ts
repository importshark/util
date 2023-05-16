import {workerData, parentPort} from "worker_threads"
import {workerDataType} from "./types/thread.types"
import * as gmll from "gmll"
import {
    setRoot
} from "gmll/config"


let data: workerDataType = workerData;


switch(data.task){
    case "mc-prep": 
    console.log("thread starting")
    setRoot(".MC")
    gmll.init().then(x => {

        new gmll.Instance({
            version: "1.19.2"
        }).install().then(x => {
            parentPort?.postMessage(`install-finish ${x.manifest.type}`) 
        }).catch(x => {
            parentPort?.postMessage(`install-error ${x}`) 
        })
    }).catch(x => {
        parentPort?.postMessage(`init-error ${x}`) 
    })
        break;
}