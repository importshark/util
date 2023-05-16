import {
    Timer,
    Time,
    TimerOptions
} from 'timer-node';
import * as fs from "fs"


let json: json = JSON.parse(fs.readFileSync("./loaderdata.json").toString())

function refresh(save: boolean) {
    switch (save) {
        case true:
            fs.writeFileSync("./loaderdata.json", JSON.stringify(json, null, 2))
            break;
        case false:
            json = JSON.parse(fs.readFileSync("./loaderdata.json").toString())
            break;

    }
}


let timer = new Timer()
interface IEvent {
    progress: number,
    name: string
}

interface Average {
    fromlast: number,
    total: number,
    name: number
}

interface Averages {
    [key: number]: Average
}

interface Divisions {
    [key: number]: number
}

let data: Average[] = [{
    name: 0,
    total: 0,
    fromlast: 0
}];


export function load(update: (event: IEvent) => void): Promise < void > {
    return new Promise((resolve) => {
        timer.start()
        let i = 0;
        let progress = 0;

        let timeout = setInterval(() => {
            i++;
            progress += 25
            update({
                progress: progress / 100,
                name: "Yay"
            })
            if (i > 3) {
                clearInterval(timeout)
                timer.stop()
                timer.clear()
                resolve()
            }
        }, 2000)
    })


}

interface Instance {
    averages: Average[]
}

interface json {
    instances: Instance[],
    averages: Averages
}


function average() {
    refresh(false)


    let divisions: Divisions = {

    }

    let data: Averages = {

    }

    let finalData: Averages = {

    }

    json.instances.forEach(x => {
        x.averages.forEach(element => {
            if (!data[element.name]) data[element.name] = {
                name: element.name,
                total: element.total,
                fromlast: 0
            }
            if (!divisions[element.name]) divisions[element.name] = 0

            data[element.name].fromlast += element.fromlast
            divisions[element.name] += 1;

        });
    })

    console.log(divisions)

    console.log(data)
    for (const key in data) {
        let value = data[key]


        finalData[value.name] = {
            fromlast: value.fromlast / divisions[value.name],
            name: value.name,
            total: value.total
        }

    }

    json.averages = finalData;

    refresh(true)


}
/*
let running = false;
let y = 0;

setInterval(() => {

    if(running) return;
    if(y < 500){
    running = true;
    load((event) => {
        console.log(event.progress)
        let time = timer.ms()
        let last = data[data.length - 1]
        console.log(last)
        data.push({
            name: event.progress,
            total: time,
            fromlast: time - last.total
        })
    }).then(() => {
        json.instances.push({
            "averages": data
        })
        running = false
        data = [{
            name: 0,
            total: 0,
            fromlast: 0
        }]
        y++;
        refresh(true)

        
    })
}else{
    
average()
}
})
    





*/