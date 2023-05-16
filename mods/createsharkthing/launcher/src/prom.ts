import deasync from "deasync"

function promise() {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 2000)
    })
}


function wrapper() {
    let done = false;
    promise().then(x => {
        done = true
    })

    while (!done) {
        deasync.sleep(100)
    }
}

console.log("Starting")
wrapper()
console.log("Done")