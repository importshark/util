import authicon from "./assets/images/auth.png"
import backicon from "./assets/images/back.png"
import checkicon from "./assets/images/check.png"
import erroricon from "./assets/images/error.png"
import logoicon from "./assets/images/logo.png"
import hideicon from "./assets/images/hide.png"
import exiticon from "./assets/images/exit.png"
import wifiicon from "./assets/images/wifi.png"
import question from "./assets/images/question.png"
import xicon from "./assets/images/x.png"
import fileicon from "./assets/images/file.png"
import loadergif from "./assets/images/loading.gif"
import infinitygif from "./assets/images/infinityloader.gif"

import statejson from "./assets/other/css.json"

interface Declaration
    {
        "property": importantkeys,
        "value": string
      }


      interface StateData{
        [key: string]: Array<Declaration> | undefined
    }

    interface StateJSON{
        rules: StateData,
        interval: number,
        time: number
    }

    

const statedata: StateJSON = <StateJSON>statejson

import {
    states
} from './states';
import "./assets/css/index.css";
import {
    hastokenresposnse
} from "./types/ipc.types"
import {
    AccessObject
} from './types/renderer';
import {
    partialstate,
    state,
    icon
} from './types/states.types';


const actiondiv = document.getElementById("actiondiv")
let image = < HTMLImageElement > document.getElementById("shark")
let imageholder = document.getElementById("imgholder")
const infodiv = document.getElementById("infoholder")
let ofidiv = document.getElementById("ofidiv")
let ofi: HTMLImageElement;
let info: HTMLElement | null;
let child: HTMLElement | null;
let wifiFails = 0;

//initialize csp tag
const csp = document.createElement("meta")
csp.setAttribute("http-equiv", "Content-Security-Policy")
csp.setAttribute("content", "default-src * blob: https: 'unsafe-eval' 'unsafe-inline' data:;")
document.querySelector("head")?.appendChild(csp)

interface PositionData{
    top: number,
    left: number,
    right: number,
    bottom: number,
    opacity: number,
    color: string
}

const importantkeys = ["top",
    "left",
    "right",
    "bottom",
    "opacity",
    "color"]

    type importantkeys = "top" |
    "left"|
    "right"|
    "bottom"|
    "opacity"|
    "color"

    function isPropertyImportant(property: string): property is importantkeys{

        if(property == "top") return true;
        if(property == "left") return true;
        if(property == "right") return true;
        if(property == "bottom") return true;
        if(property == "opacity") return true;
        if(property == "color") return true;

        return false;
    
    }

    function isObjectImportant(property: any): property is PositionData{

        if(!property["top"]) return false;
        if(!property["left"]) return false;
        if(!property["right"]) return false;
        if(!property["bottom"]) return false;
        if(!property["opacity"]) return false;
        if(!property["color"]) return false;

        return true;
    
    }
    

interface TickContext{
    start: Date,
    newstate: string,
    posiitondata: {
        actiondiv: PositionData,
        image: PositionData, 
        imageholder: PositionData,
        infodiv: PositionData,
        ofidiv: PositionData,
        ofi: PositionData,
        info: PositionData,
        child: PositionData
    }
}

const tickcontext: TickContext = {
    newstate: "start",
    start: new Date(),
    posiitondata: {
        actiondiv: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            color: ""
        },
        child: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            color: ""
        },
        ofi: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            color: ""
        },
        ofidiv: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            color: ""
        },
        info: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            color: ""
        },
        image: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            color: ""
        },
        infodiv: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            color: ""
        },
        imageholder: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            color: ""
        }
    }
}

const access: AccessObject = {
    initialtype: "true",
    username: "",
    answeredsaveaccount: "0",
    confirmed: "false"
};



let state = "beforestart";

/*
setTimeout(() => {
    window.electronAPI.emit("msshow", "hide")
}, 5000)
*/



function hide() {
    window.window.electronAPI.emit("window-hide", "hide")
}

function close() {
    console.log("[CLOSE alpha] event called.")
    window.electronAPI.emit("window-close", "close")
    window.close()
}

function buttonclick(element: string) {
    console.log(`[BTNCLICK BETA]${element} was clicked in state ${state}`)
    if (states[state].div.inttype != "button") return;
    switch (state) {
        case "error":
            updateStatus("start", false)
            break;

        case "preauthinfo":
            switch (element) {
                case "child":
                    updateStatus("preauth", false)
                    break;
                case "ofi":
                    updateStatus("typetime", false)
                    break;
            }
            break;
        case "mcfail":
            switch (element) {
                case "child":
                    ready()
                    break;
                case "ofi":
                    updateStatus("error", false)
                    break;
            }
            break;
        case "launchmc":
            switch (element) {
                case "child":
                    updateStatus("launching", false)
                    break;
            }
            break;
        case "loadfail":
            switch (element) {
                case "child":
                    updateStatus("preauth", false)
                    break;
                case "ofi":
                    updateStatus("preauthinfo", false)
                    break;
            }
            break;
        case "checksave":
            switch (element) {
                case "child":
                    access.confirmed = "true"
                    window.electronAPI.emit("save-account", "true")
                    updateStatus("prepmc", false)
                    break;
                case "ofi":
                    access.confirmed = "true"
                    window.electronAPI.emit("save-account", "false")
                    ready()
                    break;
            }

            break;
        case "confirmfinish":
            switch (element) {
                case "child":
                    if (info?.innerHTML.startsWith("The account data was loaded")) {
                        //error!
                        ready()
                    } else {
                        //success. send use account message and update status to prepmc
                        window.electronAPI.emit("use-account", "true")
                        ready()

                    }

                    break;
                case "ofi":
                    window.electronAPI.emit("use-account", "false")
                    //no need to call ready as that is handled by the use account function

                    break;
            }
            updateStatus("prepmc", false)
            break;
        case "confirmfail":
            switch (element) {
                case "child":
                    if (info?.innerHTML.startsWith("The account info failed to load, after three failed retries!")) {
                        return updateStatus("error", false)

                    } else if (info?.innerHTML.startsWith("The account info failed to load")) {
                        return updateStatus("error", false)

                    }
                    ready()
                    break;
                case "ofi":
                    updateStatus("error", false)
                    break;
            }
            break;
        case "typetime":

            switch (element) {
                case "child":
                    if (child?.innerText == "-><-" || child?.innerText.substring(2).trim() == "<-") return updateStatus("typeerror500", false)
                    else {
                        access.username = child?.innerText || "";
                        window.electronAPI.emit("set-user", access.username.substring(2, access.username.length - 2))
                        updateStatus("checksave", false)
                    }

                    break;
                case "ofi":
                    updateStatus("preauthinfo", false);
                    break;
            }
            break;
        case "typeerror404":
            updateStatus("typetime", false)
            break;
        case "typeerror500":
            updateStatus("typetime", false)
            break;
        case "autherror404":
            updateStatus("preauthinfo", false)
            break;

    }
}


let buttonmouseonlistener: boolean;
let buttonmouseofflistener;
let buttonmouseclicklistener;
let offhandclicklistener: boolean;
let refocusfuction = false;


function processnew() {


    const data = states[state]

    child = document.getElementById(data.child.id)
    ofi = < HTMLImageElement > document.getElementById(data.offhandicon.id)
    ofidiv = document.getElementById("ofidiv")
    image = < HTMLImageElement > document.getElementById(data.image.id)
    imageholder = document.getElementById(data.imagediv.id)
    info = document.getElementById(data.info.id)

    //console.log(buttonmouseonlistener)

    if (states[state].div.inttype == "button" && child) child.style.backgroundColor = "#00008b";
    if (states[state].div.inttype == "button" && !buttonmouseonlistener) {


        buttonmouseonlistener = true;
        child?.addEventListener("mouseenter", () => {
            if (states[state].div.inttype != "button") return;
            if (!child) return;
            child.style.backgroundColor = "#000075"
        })

        buttonmouseofflistener = true;
        child?.addEventListener("mouseleave", () => {
            if (states[state].div.inttype != "button") return;
            if (!child) return;
            child.style.backgroundColor = "#00008b"
        })

        buttonmouseclicklistener = true;
        child?.addEventListener("click", () => {
            console.log("[PROCESSNEW SNAIL] click event called")
            buttonclick("child")
        })
    }

    if (!data.offhandicon.class.includes("nonexistent") && !offhandclicklistener) {
        //is showing
        offhandclicklistener = true;
        if (ofi) {

            ofi.addEventListener("click", () => {
                buttonclick("ofi")
            })
        }
    }



    //get actions

    const actions = states[state].actions;
    console.log("[PROCNEW TREE] Running actions of state " + state)
    for (let i = 0; i < actions.length; i++) {
        const {
            action,
            value,
            extra
        } = actions[i];
        switch (action) {
            case "emit":
                switch (extra) {
                    case "username": {
                        //sending username
                        //remove helpers from username
                        const length = access.username.length;
                        const username = access.username.substring(2, length - 2)
                        window.electronAPI.emit(value, username)
                        break;
                    }
                    default: {
                        window.electronAPI.emit(value, < string > extra)
                        break;
                    }


                    case "set": {
                        const key: string = < string > value
                        access[key] = extra;
                        break;
                    }

                }
        }

    }

    //process extra stuff for typetime


    const textbox = < HTMLInputElement > document.getElementById("userinput")

    if (state == "typetime") textbox?.focus()

    if (!refocusfuction) {

        refocusfuction = true;
        textbox?.addEventListener("blur", () => {
            console.log("[TYPETIME PROCNEW DEBUG] blur event")
            if (state != "typetime") return;
            textbox.focus()
        })

        textbox?.addEventListener("input", () => {

            if (state != "typetime") return;
            console.log("[TYPETIME PROCNEW DEBUG] input", textbox.value)
            if (!child) console.warn("Child doesn't exist? typetime text update")
            else {
                child.innerHTML = `->${textbox.value}<-`
            }
        })
        textbox?.focus()

    }


}

function getIcon(ico: icon): string {
    let returnicon;

    switch (ico) {
        case icon.authicon:
            returnicon = authicon;
            break;
        case icon.backicon:
            returnicon = backicon;
            break;
        case icon.checkicon:
            returnicon = checkicon;
            break;
        case icon.erroricon:
            returnicon = erroricon;
            break;
        case icon.logoicon:
            returnicon = logoicon;
            break;
        case icon.wifiicon:
            returnicon = wifiicon;
            break;
        case icon.fileicon:
            returnicon = fileicon;
            break;
        case icon.question:
            returnicon = question;
            break;
        case icon.xicon:
            returnicon = xicon;
            break;
        case icon.loader:
            returnicon = loadergif;
            break;
        case icon.inifinity:
            returnicon = infinitygif;
            break;
    }
    return returnicon;
}

function conversionFactor(min: number, max: number, input: number){

    if(input >= max) return max;

    //rate
    const num = min
    //time
    const dena = 1
    //x
    const numb = 1
    //difference
    const denb = input

}

function tick(){
    console.log("Tick to new state: " + tickcontext.newstate)
    //tickcontext
    //get the difference between start and now
    const now = new Date()
    //difference in seconds
    const difference = (now.getTime() - tickcontext.start.getTime()) / 1000

    //building a conversion factor
    
    //where it needs to be vs where it is
    const whereitis = tickcontext.posiitondata.child

    const newstatedata = states[tickcontext.newstate]
    if(!newstatedata) return;

    //get the classes of that state
    const classes = newstatedata.child.class;

    //make defaults for state overlaps

    let classdata: false | number = false;
    classes.forEach((x, index) => {
        
        if(statedata.rules[x] !== undefined) return;
            const posdata = statedata.rules[x]
            
        
        if(!classdata){
            
            posdata?.forEach(y => {
                if(classdata) return;
                if(importantkeys.includes(y.property)) classdata = index;
            })
        }
        
    })
    if(!classdata) return console.error("Did not get")

    const classtoreadfrom = classes[classdata]
    const classdatatoreadfrom = statedata.rules[classtoreadfrom]

    const firstobject: Partial<PositionData> = {}

    classdatatoreadfrom?.forEach(x => {


        if(x.property == "color") firstobject[x.property] = x.value
        else firstobject[x.property] = Number(x.value)
        
    })




    if(!isObjectImportant(firstobject)) return;

    const whereitneedstobe: PositionData = firstobject

    //distance = rate time
    //r = d/t
    //calculate this for all attribs

    //important we calculate distance for precentages

    const distancediff = Number((whereitis.top - whereitneedstobe.top).toString().replace("-", ""))

    const chunksize = distancediff / statedata.interval;

    //move that much toward destination
    //determind which is larger
    if(whereitis.top > whereitneedstobe.top){
        //to move should be decvrease
        if(child) child.style.top = `${whereitis.top - chunksize}`
    }else{
        //to move should be incvrease
        if(child) child.style.top = `${whereitis.top + chunksize}`
    }

}

function newUpdateStatus(newstate: string){
    tickcontext.start = new Date()
}

function _updateStatus(newstate: string, customdata ? : partialstate) {

    console.log(`[UPDI PAIN] Updating state to ${newstate}`)

    const oldtype = states[state].div.type;
    child = document.getElementById(states[state].child.id)
    ofi = < HTMLImageElement > document.getElementById(states[state].offhandicon.id)

    const data = states[newstate]


    state = newstate

    if (customdata) {
        if (customdata.div) {
            data.div.type = customdata.div.type || data.div.type;
            data.div.inttype = customdata.div.inttype || data.div.inttype;
            data.div.class = customdata.div.class || data.div.class;
        }
        if (customdata.child) {
            data.child.div = customdata.child.div || data.child.div;
            data.child.class = customdata.child.class || data.child.class;
            data.child.id = customdata.child.id || data.child.id;
            data.child.innerHtml = customdata.child.innerHtml || data.child.innerHtml;
        }
        if (customdata.offhandicon) {
            data.offhandicon.div = customdata.offhandicon.div || data.offhandicon.div;
            data.offhandicon.class = customdata.offhandicon.class || data.offhandicon.class;
            data.offhandicon.id = customdata.offhandicon.id || data.offhandicon.id;
            data.offhandicon.alt = customdata.offhandicon.alt || data.offhandicon.alt;
            data.offhandicon.src = customdata.offhandicon.src || data.offhandicon.src;
        }
        if (customdata.info) {
            data.info.div = customdata.info.div || data.info.div;
            data.info.class = customdata.info.class || data.info.class;
            data.info.id = customdata.info.id || data.info.id;
            data.info.innerHtml = customdata.info.innerHtml || data.info.innerHtml;
        }
        if (customdata.image) {
            data.image.div = customdata.image.div || data.image.div;
            data.image.class = customdata.image.class || data.image.class;
            data.image.id = customdata.image.id || data.image.id;
            data.image.alt = customdata.image.alt || data.image.alt;
            data.image.src = customdata.image.src || data.image.src;
        }
        if (customdata.imagediv) {
            data.imagediv.id = customdata.imagediv.id || data.imagediv.id;
            data.imagediv.class = customdata.imagediv.class || data.imagediv.class;
        }
    }

    //exit and hide buttons

    const bgbutton = < HTMLImageElement > document.getElementById("backgroundButton")
    const exitbutton = < HTMLImageElement > document.getElementById("exitButton")
    if (bgbutton) bgbutton.src = hideicon
    if (exitbutton) exitbutton.src = exiticon

    //actiondiv
    //remove all classes

    if (actiondiv) {


        actiondiv.className = ""


        //set classes to data
        for (let i = 0; i < data.div.class.length; i++) {
            const element = data.div.class[i];
            actiondiv.classList.add(element)
        }
    } else {
        console.warn("Actiondiv object does not seem to exist. Skipping state modifications!")
    }

    //child
    if (child) {
        child.className = ""

        //set classes to data
        switch (oldtype === data.div.type) {
            case true:


                for (let i = 0; i < data.child.class.length; i++) {
                    const element = data.child.class[i];
                    child.classList.add(element)
                }
                child.id = data.child.id;
                child.innerHTML = data.child.innerHtml;
                child.style.backgroundColor = ""

                break;
            case false: {
                child.remove()
                const newchild = document.createElement(data.div.type)
                for (let i = 0; i < data.child.class.length; i++) {
                    const element = data.child.class[i];
                    newchild.classList.add(element)
                }
                newchild.id = data.child.id;
                newchild.innerHTML = data.child.innerHtml;

                actiondiv?.appendChild(newchild)
                child = newchild;

                break;
            }
        }

        if (actiondiv) {
            if (data.child.div) {
                let found = false;

                for (let i = 0; i < (actiondiv.children).length; i++) {
                    const element = (actiondiv.children)[i];
                    if (element.id === states[state].child.id) {
                        found = true;
                    }

                }
                if (!found) {
                    actiondiv.appendChild(child)
                }
            } else {
                try {
                    actiondiv.removeChild(child)
                } catch (error) {
                    console.warn("Failed to remove child from actiondiv. This may be an error but most likely is normal operation.")
                }

                document.body.appendChild(child)
            }
        } else {
            console.warn("actiondiv does not seem to exist. Skipping div modifications for child!")
        }
    } else {
        console.warn("Child object does not seem to exist. Skipping state modifications!")
    }


    if (ofi) {


        //helpericon
        ofi.className = ""

        //set classes to data



        for (let i = 0; i < data.offhandicon.class.length; i++) {
            const element = data.offhandicon.class[i];
            ofi.classList.add(element)
        }
        ofi.id = data.offhandicon.id;
        //console.log("debugofi " + getIcon(data.offhandicon.src))
        if (typeof data.offhandicon.src == "string") {
            ofi.src = data.offhandicon.src;
        } else {
            ofi.src = getIcon(data.offhandicon.src);
        }

        ofi.alt = data.offhandicon.alt;

        if (ofidiv) {


            if (data.offhandicon.div) {
                let found = false;

                for (let i = 0; i < (ofidiv.children).length; i++) {
                    const element = (ofidiv.children)[i];
                    if (element.id === states[state].offhandicon.id) {
                        found = true;
                    }

                }
                if (!found) {
                    ofidiv.appendChild(ofi)
                }
            } else {
                try {
                    ofidiv.removeChild(ofi)
                } catch (error) {
                    console.warn("Failed to remove child from actiondiv. This may be an error but most likely is normal operation.")
                }

                document.body.appendChild(ofi)
            }
        } else {
            console.warn("OFI div does not seem to exist. Skipping div modifications for ofi!")
        }
    } else {
        console.warn("OFI object does not seem to exist. Skipping state modifications!")
    }

    if (imageholder) {

        //imageholder
        //remove all classes

        imageholder.className = ""


        //id and src
        imageholder.id = data.imagediv.id;

        //set classes to data
        for (let i = 0; i < data.imagediv.class.length; i++) {
            const element = data.imagediv.class[i];
            imageholder.classList.add(element)
        }

        if (data.image.div) {
            let found = false;

            for (let i = 0; i < (imageholder.children).length; i++) {
                const element = (imageholder.children)[i];
                if (element.id === states[state].image.id) {
                    found = true;
                }

            }
            if (!found) {
                imageholder.appendChild(image)
            }
        } else {
            try {
                image.removeChild(image)
            } catch (error) {
                console.warn("Failed to remove image from imageholder. This may be an error but most likely is normal operation.")
            }

            document.body.appendChild(image)
        }

    }


    //image
    //remove all classes

    if (info) {
        image.className = ""


        //id and src
        if (typeof data.image.src == "string") {
            image.src = data.image.src;
        } else {
            image.src = getIcon(data.image.src);
        }
        image.id = data.image.id;

        //set classes to data
        for (let i = 0; i < data.image.class.length; i++) {
            const element = data.image.class[i];
            image.classList.add(element)
        }


        //info
        //remove all classes

        info.className = ""


        //id and src
        info.id = data.info.id;
        info.innerHTML = data.info.innerHtml

        //set classes to data
        for (let i = 0; i < data.info.class.length; i++) {
            const element = data.info.class[i];
            info.classList.add(element)
        }

        if (infodiv) {


            if (data.info.div) {
                let found = false;

                for (let i = 0; i < (infodiv.children).length; i++) {
                    const element = (infodiv.children)[i];
                    if (element.id === states[state].info.id) {
                        found = true;
                    }

                }
                if (!found) {
                    infodiv.appendChild(info)
                }
            } else {
                try {
                    infodiv.removeChild(info)
                } catch (error) {
                    console.warn("Failed to remove info from holder. This may be an error but most likely is normal operation.")
                }

                document.body.appendChild(info)
            }
        } else {
            console.warn("Info div does not seem to exist. Skipping div modifications for info!")
        }

    } else {
        console.warn("Info does not seem to exist. Skipping state modifications for info!")
    }



    //typetime clear input
    if (newstate == "typetime") {
        const tb = < HTMLInputElement > document.getElementById("userinput")
        if (tb) tb.value = ""
        tb?.focus()
    }

    processnew()

    console.log("[UPDI DEBUG PALE] State finished loading!")


}

function updateStatus(newstate: string, readystate: boolean, customdata ? : partialstate) {

    // eslint-disable-next-line no-debugger
    //debugger;
    console.log(`[UPDA TUCK] Recieved update ${newstate}`)


    let modecover = true;

    if (state == newstate && readystate) {
        console.log("[UPDA CHECK DOOR] State is the same but ready is present so running with no cover")
        modecover = false;
    }

    console.log("[UPDA CHECK DOOR] Passed ready cover check")

    if (state == "beforestart") {
        console.log("[UPDA CHECK RULE] Current state is beforestart. Not loading cover.")
        modecover = false;
    } else if (state == newstate && !readystate) {
        return console.log("[UPDA CHECK SOAP] State is the same but ready is not present so exiting");
    }

    console.log("[UPDA CHECK LAME] Passed beforestart and dupe state check")
    if (!states[newstate]) {
        return console.log("[UPDA CHECK NONE] New state does not exist");
    }
    console.log("[UPDA CHECK NONE] Passed nonexistent state check")
    if (wifiFails >= 3 && newstate != "wifilost") {
        return console.log('[UPDA CHECK WIFI] Refusing to load new state because wifi is in fail state');
    }
    console.log("[UPDA CHECK WIFI] Passed wifi check")
    if (newstate == "start" && state != "beforestart") {
        console.log("[UPDA CHECK REED] Been directed to load start from a non startup state. Treating this as a ready request!")
        return ready()
    }
    console.log("[UPDA CHECK REED] Passed ready check")

    console.log("[UPDA CHECK DONE] loading said state")


    if (modecover) {
        toggle()
        setTimeout(() => {
            _updateStatus(newstate, customdata)

        }, 250)
    } else {
        _updateStatus(newstate, customdata)
    }



}



function toggle() {
    const tr = document.getElementById("cover")

    if (!tr) return console.log("[TOGG CHECK COVE] Cover object does not exist!")
    tr?.classList.remove("nonexistent")
    tr?.classList.add("transition")
    setTimeout(() => {
        tr.classList.add("nonexistent")
        tr.classList.remove("transition")
    }, 500)


}

function emitWithResponse(channel: string, args ? : string) {
    return new Promise((resolve, reject) => {
        window.electronAPI.emit(channel, args)
        window.electronAPI.handle(channel + "-res", (arg: unknown) => {
            resolve(arg)
        })

        setTimeout(() => {
            reject()
        }, 3000)
    })
}




interface uuidData {
    "id": string,
    "name": string
}

function setImage() {
    const element = < HTMLImageElement > document.getElementById("helpericon")
    if (element) element.src = "http://localhost:3001/logo.png"
}

interface AvatarObject {
    [key: string]: any,
    username: string
}

interface UUIDResponse {
    "cache": {
        "HIT": false,
        "cache_time": 518400,
        "cache_time_left": 518399,
        "cached_at": 1683998894.562553,
        "cached_until": 1684517294.562553
    },
    "id": string,
    "name": string,
    "status": "OK"
}

function _getLink(url: string, blob: boolean): Promise < Blob | Response | UUIDResponse > {
    // Create new promise with the Promise() constructor;
    // This has as its argument a function with two parameters, resolve and reject
    return new Promise(function(resolve, reject) {
        // Standard XHR to load an image
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = blob ? 'blob' : "json";

        // When the request loads, check whether it was successful
        request.onload = function() {
            if (request.status === 200) {
                // If successful, resolve the promise by passing back the request response
                resolve(request.response);
            } else {
                // If it fails, reject the promise with a error message
                reject(new Error('Image didn\'t load successfully; error code:' + request.statusText));
            }
        };

        request.onerror = function() {
            // Also deal with the case when the entire request fails to begin with
            // This is probably a network error, so reject the promise with an appropriate message
            reject(new Error('There was a network error.'));
        };

        // Send the request
        request.send();
    });
}









function getAvatar(user: string | AvatarObject): Promise < string | false > {

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            //assume avatar get failed
            console.error("Avatar timed out. Resolving false")
            resolve(false)
        }, 3000)

        try {


            const username: string = (typeof user == "string") ? user : user.username


            console.log("[AVAT DEBUG LAWN] Getting avatar of user ")
            console.log("[AVAT DEBUG USER] " + username)
            _getLink(`https://api.minetools.eu/uuid/${username}`, false).then(res => {
                    clearTimeout(timeout)
                    if (res instanceof Blob) return console.log("[AVAT ERR RES] is blob ")
                    if (res instanceof Response) {

                        res.json().then(y => {
                            console.log("[AVAT DEBUG UUID] Uuid api response json: ")
                            console.log(y)
                            if (!y.id) {
                                console.error("No id on response!")
                                clearTimeout(timeout)
                                resolve(false)
                            }
                            _getLink(`https://crafatar.com/avatars/${y.id}`, true).then(res2 => {

                                if (res2 instanceof Blob) {
                                    const reader = new FileReader();
                                    reader.readAsDataURL(res2);
                                    reader.onloadend = function() {
                                        if (typeof reader.result != "string") {
                                            console.log("Reader result is not string? Result: /\\")
                                            console.log(reader.result)
                                            resolve(false)
                                            return;
                                        }
                                        resolve(reader.result)
                                    }

                                } else {
                                    console.log("[AVAT ERR RES] is not blob!")
                                    resolve(false)
                                }

                            })
                        }).catch(x => {
                            console.log("Error parsing json in avat! E: " + x)
                            resolve(false)
                        })


                    } else {

                        console.log("[AVAT DEBUG UUID] Uuid api response json: ")
                        console.log(res)
                        if (!res.id) {
                            console.error("No id on response!")
                            clearTimeout(timeout)
                            resolve(false)
                        }
                        _getLink(`https://crafatar.com/avatars/${res.id}`, true).then(res2 => {

                            if (res2 instanceof Blob) {
                                const reader = new FileReader();
                                reader.readAsDataURL(res2);
                                reader.onloadend = function() {
                                    if (typeof reader.result != "string") {
                                        console.log("Reader result is not string? Result: /\\")
                                        console.log(reader.result)
                                        resolve(false)
                                        return;
                                    }
                                    resolve(reader.result)
                                }
                            } else {
                                console.log("[AVAT ERR RES] is not blob!")
                                resolve(false)
                            }

                        })
                    }


                })



                .catch(x => {
                    console.error("get avatar fetch catch failed. Eror: ")
                    console.error(x)
                    clearTimeout(timeout)
                    resolve(false)
                })

        } catch (error) {
            console.error("[AVAT ERR DINE] get avatar + uuid outer function failed failed. Eror: " + error)
            clearTimeout(timeout)
            resolve(false)
        }

    })
    try {

        /*
        let uuid: uuidData;
        try{    
            uuid = JSON.parse(uuidres)
            if(!uuid.id){
                console.error("Id does not exist on parsed uuid object. Exiting.")
                return;
            }

            console.log("Now getting avatar,")
            const avatarres = httpGet(`https://crafatar.com/avatars/${uuid.id}?size=200&overlay=true`)
            console.log("Get avatar image response: " + avatarres)
            let avatar;

            try{    
                avatar = avatarres
                if(!avatar){
                    console.error("Avatar does not exist. Exiting.")
                    return;
                }

            

        }catch(e){
            console.error("get avatar failed. Eror: " + e)
        }

        }catch(e){
            console.error("get avatar + uuid failed. Eror: " + e)
        }*/
    } catch (e) {
        //
    }






}

function checkMemoryEquals(data: hastokenresposnse) {
    //
}
/*
{
                                info: {
                                    innerHtml: "The account info failed to load, after three failed retries! You can submit an error report by hitting the file icon."
                                },
                                offhandicon: {
                                    class: ["helpericon"]
                                },
                                child: {
                                    innerHtml: "Continue"
                                }
                            }
*/

function ready() {
    emitWithResponse("has-token").then(res => {
        const data = < hastokenresposnse > res;

        console.log("[READ DEBUG LAKE] token mc status \\/")
        console.log(res)

        if (access.confirmed == "false") {

            if (data.memory.state == 3) {
                console.log("[READ DEBUG PARK] Data memory state thing is 3 and does not match")
                updateStatus("confirmacc", true)
                console.log('[READ DEBUG SAME] Set status. Proceeding to get the avatar.')

                return getAvatar(data.memory.username).then(x => {
                    if (!x) {
                        console.error("[AVAT ERR PORK] Could not load avatar. telling the user.");
                        const fails = Number(access.avatarfail)
                        if (typeof fails != "number") {
                            console.error("[AVAT ERR CORN] fails is not number? fails:")
                            console.info("[AVAT DEBUG CORN] " + fails)
                            return;
                        }
                        access.avatarfail = `${fails + 1}`
                        if ((fails + 1) > 3) {
                            return updateStatus("confirmfail", true)
                        } else {
                            return updateStatus("confirmfail", true, {
                                info: {
                                    innerHtml: "The account info failed to load. You can try again below or continue without the save with the back button."
                                },
                                offhandicon: {
                                    class: ["helpericon"],
                                    src: icon.backicon
                                },
                                child: {
                                    innerHtml: "Retry"
                                }
                            })


                        }

                    }
                    let acc;
                    if (data.memory.state == 3) acc = (typeof data.memory.username == "string") ? data.memory.username : data.memory.username.username;
                    else {
                        console.log("[AVAT DEBUG LAWN] Updating to preauthinfo")
                        return updateStatus("preauthinfo", true)
                    }
                    updateStatus("confirmfinish", true, {
                        image: {
                            src: x
                        },
                        info: {
                            innerHtml: `Currently using account: ${acc}. Is this right?`
                        },
                        child: {
                            innerHtml: "Confirm account."
                        },
                        offhandicon: {
                            class: ["helpericon"],
                            src: icon.backicon
                        }
                    })
                }).catch(x => {
                    console.log("[AVAT DEBUG PANE] Get avatar catch shouldnt be called: " + x)
                })

            }


        }

        //memory 0 not exist 1 not confirmed 2 not using 3 using



        if (data.auth.online == 0) {
            if (data.memory.state == 0 || data.memory.state == 1) {

                if (access.username) {

                    return updateStatus("checksave", true)
                } else {
                    return updateStatus("preauthinfo", true)
                }
            } else if (data.memory.state == 2) {

                if (access.username) {
                    return updateStatus("prepmc", true)
                } else {
                    return updateStatus("preauthinfo", true)
                }

            } else {
                if (access.username) {
                    return updateStatus("prepmc", true)
                } else {
                    return updateStatus("preauthinfo", true)
                }
            }
        } else {
            if (data.memory.state == 0 || data.memory.state == 1) {


                if (data.auth.state == 0) return updateStatus("preauthinfo", true)
                else return updateStatus("checksave", true)

            } else {
                if (data.auth.state == 0) return updateStatus("preauthinfo", true)
                else return updateStatus("prepmc", true)
            }
        }




    })
}

function test(act: string) {
    window.electronAPI.emit("test", act)
}

function processGlobals() {
    window.ready = ready;
    window.updateStatus = updateStatus;
    window.getAvatar = getAvatar;
    window.setImage = setImage;
    window.test = test
}

processGlobals()



function update(info: any) {
    console.info(info)
}

//console.log("starting proceses")
//window.electronAPI.emit("proc-begin")
console.log("[MAIN DEBUG] Creating listeners...")
document.getElementById("backgroundButton")?.addEventListener("click", hide)
document.getElementById("exitButton")?.addEventListener("click", close)
window.electronAPI.handle("update", update)
window.electronAPI.handle("test", () => {
    console.log("[TEST DINO] test")
})

window.electronAPI.handle("auth-show", () => {
    updateStatus("postAuth", false)
})


window.electronAPI.handle("auth-done", (input: any) => {

    const use: boolean = input
    console.log("Authdone with input " + use)
    if (!use) {
        return updateStatus("autherror404", false)
    }
    return updateStatus("checksave", false)
})

window.electronAPI.handle("auth-close", (error: any) => {
    console.log("[EV AUTO] Auth close")
    console.log(error)
    if (error.err) {
        console.log("[EV LONG] Auth close came back with err")
        return handleauthfail(error.err)
    }
    console.log("[MAIN DEBUG LORD] Auth closed successfully. Handling auth.")
    window.electronAPI.emit("auth-handle")
})

//window.electronAPI.handle("auth-fail", handleauthfail)
interface AuthPageFail {
    err: string
}

function handleauthfail(input: unknown) {
    console.log("[AUTF ERR]")
    console.log("[AUTF ERR] " + input)
    const error = String(input)
    const errorarray: string[] = []
    let done = false;

    if (!error) return console.log("[AUTF ERR NAME] No err on auth fail!");
    let d = String(error);
    d = d.substring(d.indexOf("Error") + 7)
    const e = d.split("")
    e.forEach((element: string) => {
        if (element == " ") {
            if (done) return;
            done = true;
            updateStatus("loadfail", false, {
                info: {
                    innerHtml: "Loading the authorization page failed. The error is: " + errorarray.join("")
                }
            })
        } else {
            errorarray.push(element.toLowerCase())
        }


    });


}


function handleminecraftclose() {
    console.log("[MCLO NORM HOPE] Minecraft closed")
    updateStatus("prepmc", false)
}

function handleminecraftready() {
    console.log("[MCRE NORM YEET] Minecraft ready")
    updateStatus("launchmc", false)
}

function handleminecraftfail(error: unknown) {
    console.log("[MCCF NORM DORK] Minecraft failed " + error)
    if (error == "not-own") return updateStatus("autherror404", false)
    updateStatus("mcfail", false)
}

function handlebaseerror(error ? : any) {
    console.log("[BASE ERR POLE] Recieved error " + error)
    updateStatus("error", false, {
        info: {
            innerHtml: `An error has occured. The error is: ${error}`
        }
    })
}

/*
function handlefastauthfailed(){
    updateStatus("typeerror404")
}*/


window.electronAPI.handle("wifi", (x) => {
    if (!x || String(x).startsWith("Error:")) {
        wifiFails++;
        if (wifiFails >= 3 && state != "errorunsolve") {
            updateStatus("wifilost", false)
        }
    } else {
        wifiFails = 0;
        if (state == "wifilost") ready();

    }
})


window.electronAPI.handle("proc-done", ready)
window.electronAPI.handle("ready", ready)
window.electronAPI.handle("mc-ready", handleminecraftready)
window.electronAPI.handle("mc-close", handleminecraftclose)
window.electronAPI.handle("mc-fail", handleminecraftfail)

window.electronAPI.handle("error", handlebaseerror)

console.log("[MCLO NORM STAR] Listeners registered. Starting tick engine")


const interval = setInterval(() => {
        tick()
})

processnew()
//toggle()
console.log("Loading initial state.")
updateStatus("start", false)