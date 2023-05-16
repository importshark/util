/*import {
    runThread
} from "./thread"
import timers from "timer-node"


const timer = new timers.Timer()


const worker = runThread({
    task: "mc-prep"
})

worker.stdout.on("data", (chunk) => {
    console.log("chunk " + String(chunk))
})

worker.on("exit", (code) => {
    console.log("Exited with code " + code)
    timer.stop()
    console.log(timer.time())
})

worker.on("error", (err) => {
    console.log("erred " + err)
})

worker.on("message", (message) => {
    console.log("Sent message " + String(message))
})

worker.on("online", () => {
    console.log("Worker online")
    timer.start()
})*/