
const {states} = require('./states.js');
const css = require("../css/index.css")

const actiondiv = document.getElementById("actiondiv")
let image = document.getElementById("shark")
let imageholder = document.getElementById("imgholder")
let infodiv = document.getElementById("infoholder")
let ofidiv = document.getElementById("ofidiv")
let ofi;
let info;
let child;
let wifiFails = 0;

const typekeys = [];
const other = ["Control", "CapsLock", "Shift", "Enter", "Space", "!", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", ":", ",", "?", ".", "`", "~", "[", "]", "{", "}", "'", `"`, "\\", "|", "/"];
let access = {
    initialtype: true
};


let state = "beforestart";

/*
setTimeout(() => {
    window.electronAPI.emit("msshow", "hide")
}, 5000)
*/



function hide(){
    window.electronAPI.emit("window-hide", "hide")
}

function close(){
    console.log("close")
    window.electronAPI.emit("window-close", "close")
}

function buttonclick(element){
    console.log(`${element} was clicked in state ${state}`)
    if(states[state].div.inttype != "button") return;
    switch(state){
        case "error": 
            updateStatus("start")
        break;
        case "preauth":
            switch(element){
                case "child":
                    window.electronAPI.emit("auth-show")
                    updateStatus
            }
            break;
            case "preauthinfo":
            switch(element){
                case "child":
                    updateStatus("confirmacc")
                    break;
                case "ofi":
                    updateStatus("typetime")
                    break;
            }
            break;
            case "launchmc":
            switch(element){
                case "child":
                    updateStatus("launched")
                    window.electronAPI.emit("launch-mc")
                    break;
            }
            break;
            case "loadfail":
                switch(element){
                    case "child":
                        updateStatus("preauth")
                        break;
                    case "ofi":
                        updateStatus("preauthinfo")
                        break;
                }
                break;
            case "typetime":
                
                switch (element) {
                    case "child":
                        if(child.innerText == "-><-" || child.innerText.substring(2).trim() == "<-") return updateStatus("typeerror500")
                        else{
                            access.username = child.innerText;
                        updateStatus("prepmc")
                        }
                        
                        break;
                    case "ofi":
                        updateStatus("preauthinfo");
                        break;
                }
                break;
            case "typeerror404":
                updateStatus("typetime")
                break;
            case "typeerror500":
                updateStatus("typetime")
                break;
                
    }
}


function type(e){
    console.log(`Type event ${e} recieved in state ${state}`)
    console.log(e)
    if(state != "typetime") return;


    if(other.includes(e.key)) return;
    if(access.initialtype) {
        child.innerText = "-><-"
        access.initialtype = false;
    }

    if(e.key.toLowerCase() == "v" && e.ctrlKey){
        navigator.clipboard.readText().then(x => {
            let a = child.innerText.split("")
            a.pop()
            a.pop()
            child.innerText = a.join("")
            child.innerText += x;
            child.innerText += "<-";
        })
    }

    else if(e.key.toLowerCase() == "backspace"){
        let array = child.innerText.split("")
        array.pop()
        array.pop()
        array.pop();
        if(array.length < 2) return;
        return child.innerText = `${array.join("").toString()}<-`;
    }

    else{


        let a = child.innerText.split("")
            a.pop()
            a.pop()
            child.innerText = a.join("")
            child.innerText += e.key;
            child.innerText += "<-";

    }


    
    

}




let buttonmouseonlistener;
let buttonmouseofflistener;
let buttonmouseclicklistener;
let offhandclicklistener;
  


function processnew(){
    let data = states[state]
    
    child = document.getElementById(data.child.id)
    ofi = document.getElementById(data.offhandicon.id)
    ofidiv = document.getElementById("ofidiv")
    image = document.getElementById(data.image.id)
    imageholder = document.getElementById(data.imagediv.id)
    info = document.getElementById(data.info.id)

    console.log(buttonmouseonlistener)

    if(states[state].div.inttype == "button") child.style.backgroundColor = "#00008b";
    if(states[state].div.inttype == "button" && !buttonmouseonlistener){
        
        buttonmouseonlistener = true;
        child.addEventListener("mouseenter", () => {
            if(states[state].div.inttype != "button") return;
           child.style.backgroundColor = "#000075"
        })
        buttonmouseofflistener = true;
        child.addEventListener("mouseleave", () => {
            if(states[state].div.inttype != "button") return;
            child.style.backgroundColor = "#00008b"
        })
        buttonmouseclicklistener = true;
        child.addEventListener("click", () => {
            console.log("clicke")
            buttonclick("child")
        })
    }

    if(!data.offhandicon.class.includes("nonexistent") && !offhandclicklistener){
        //is showing
        offhandclicklistener = true;
        ofi.addEventListener("click", () => {
            buttonclick("ofi")
        })
    }


    //get actions

    const actions = states[state].actions;
    for (let i = 0; i < actions.length; i++) {
        const {action, value, extra} = actions[i];
        switch(action){
            case "emit":
                switch(extra){
                    case "username":
                        //sending username
                        //remove helpers from username
                        let length = access.username.length;
                        let username = access.username.substring(2, length - 2)
                        window.electronAPI.emit(value, username)
                        break;
                    default: 
                        window.electronAPI.emit(value, extra)
                        break;
                }
                
            break;
            case "set":
                access[value] = extra;
                break;
        }
    }

    document.onkeyup = type;
    

}

function updateStatus(newstate, customdata){
    //debugger;
    console.log(`Recieved update ${newstate}`)
    if(state == newstate) return;
    if(!states[newstate]) return;
    if(wifiFails >= 3 && newstate != "wifilost") return;

    console.log("loading said state")
    

    if(state != "beforestart") toggle()

    setTimeout(() => {

    

    const oldtype = states[state].div.type;
    child = document.getElementById(states[state].child.id)
    ofi = document.getElementById(states[state].offhandicon.id)

    let data = states[newstate]


    state = newstate

    if(customdata){
        if(customdata.div){
            data.div.type = (customdata.div.type) ? customdata.div.type : data.div.type;
            data.div.inttype = (customdata.div.inttype) ? customdata.div.inttype : data.div.inttype;
            data.div.class = (customdata.div.class) ? customdata.div.class : data.div.class;
        }
        if(customdata.child){
            data.child.div = (customdata.child.div) ? customdata.child.div : data.child.div;
            data.child.class = (customdata.child.class) ? customdata.child.class : data.child.class;
            data.child.id = (customdata.child.id) ? customdata.child.id : data.child.id;
            data.child.innerHtml = (customdata.child.innerHtml) ? customdata.child.innerHtml : data.child.innerHtml;
        }
        if(customdata.offhandicon){
            data.offhandicon.div = (customdata.offhandicon.div) ? customdata.offhandicon.div : data.offhandicon.div;
            data.offhandicon.class = (customdata.offhandicon.class) ? customdata.offhandicon.class : data.offhandicon.class;
            data.offhandicon.id = (customdata.offhandicon.id) ? customdata.offhandicon.id : data.offhandicon.id;
            data.offhandicon.alt = (customdata.offhandicon.alt) ? customdata.offhandicon.alt : data.offhandicon.alt;
            data.offhandicon.src = (customdata.offhandicon.src) ? customdata.offhandicon.src : data.offhandicon.src;
        }
        if(customdata.info){
            data.info.div = (customdata.info.div) ? customdata.info.div : data.info.div;
            data.info.class = (customdata.info.class) ? customdata.info.class : data.info.class;
            data.info.id = (customdata.info.id) ? customdata.info.id : data.info.id;
            data.info.innerHtml = (customdata.info.innerHtml) ? customdata.info.innerHtml : data.info.innerHtml;
        }
        if(customdata.image){
            data.image.div = (customdata.image.div) ? customdata.image.div : data.image.div;
            data.image.class = (customdata.image.class) ? customdata.image.class : data.image.class;
            data.image.id = (customdata.image.id) ? customdata.image.id : data.image.id;
            data.image.alt = (customdata.image.alt) ? customdata.image.alt : data.image.alt;
            data.image.src = (customdata.image.src) ? customdata.image.src : data.image.src;
        }
        if(customdata.imagediv){
            data.imagediv.id = (customdata.imagediv.id) ? customdata.imagediv.id : data.imagediv.id;
            data.imagediv.class = (customdata.imagediv.class) ? customdata.imagediv.class : data.imagediv.class;
        }
    }

    //actiondiv
    //remove all classes

    actiondiv.className = ""


    //set classes to data
    for (let i = 0; i < data.div.class.length; i++) {
        const element = data.div.class[i];
        actiondiv.classList.add(element)
    }

    //child
    child.className = ""

    //set classes to data
    switch(oldtype === data.div.type){
        case true:


            for (let i = 0; i < data.child.class.length; i++) {
                const element = data.child.class[i];
                child.classList.add(element)
            }
            child.id = data.child.id;
            child.innerHTML = data.child.innerHtml;
            child.style.backgroundColor = ""

            break;
        case false:
            child.remove()
            const newchild = document.createElement(data.div.type)
            for (let i = 0; i < data.child.class.length; i++) {
                const element = data.child.class[i];
                newchild.classList.add(element)
            }
            newchild.id = data.child.id;
            newchild.innerHTML = data.child.innerHtml;

            actiondiv.appendChild(newchild)
            child = newchild;

            break;
    }

    if(data.child.div){
        let found = false;

        for (let i = 0; i < (actiondiv.children).length; i++) {
            const element = (actiondiv.children)[i];
            if(element.id === states[state].child.id){
                found = true;
            }
            
        }
        if(!found){
            actiondiv.appendChild(child)
        }
    }else{
        try {
            actiondiv.removeChild(child)
        } catch (error) {
            console.warn("Failed to remove child from actiondiv. This may be an error but most likely is normal operation.")
        }
        
        document.body.appendChild(child)
    }

    //helpericon
    ofi.className = ""

    //set classes to data



            for (let i = 0; i < data.offhandicon.class.length; i++) {
                const element = data.offhandicon.class[i];
                ofi.classList.add(element)
            }
            ofi.id = data.offhandicon.id;
            ofi.src = data.offhandicon.src;
            ofi.alt = data.offhandicon.alt;


    if(data.offhandicon.div){
        let found = false;

        for (let i = 0; i < (ofidiv.children).length; i++) {
            const element = (ofidiv.children)[i];
            if(element.id === states[state].offhandicon.id){
                found = true;
            }
            
        }
        if(!found){
            ofidiv.appendChild(ofi)
        }
    }else{
        try {
            ofidiv.removeChild(ofi)
        } catch (error) {
            console.warn("Failed to remove child from actiondiv. This may be an error but most likely is normal operation.")
        }
        
        document.body.appendChild(ofi)
    }

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

    if(data.image.div){
        let found = false;

        for (let i = 0; i < (imageholder.children).length; i++) {
            const element = (imageholder.children)[i];
            if(element.id === states[state].image.id){
                found = true;
            }
            
        }
        if(!found){
            imageholder.appendChild(image)
        }
    }else{
        try {
            image.removeChild(image)
        } catch (error) {
            console.warn("Failed to remove image from imageholder. This may be an error but most likely is normal operation.")
        }
        
        document.body.appendChild(image)
    }
    
    //image
    //remove all classes

    image.className = ""


    //id and src
    image.src = data.image.src;
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

    if(data.info.div){
        let found = false;

        for (let i = 0; i < (infodiv.children).length; i++) {
            const element = (infodiv.children)[i];
            if(element.id === states[state].info.id){
                found = true;
            }
            
        }
        if(!found){
            infodiv.appendChild(info)
        }
    }else{
        try {
            infodiv.removeChild(info)
        } catch (error) {
            console.warn("Failed to remove info from holder. This may be an error but most likely is normal operation.")
        }
        
        document.body.appendChild(info)
    }
    
    
    


    

    

    processnew();
}, 250)

}



function toggle(){
    let tr = document.getElementById("cover")

    tr.classList.remove("nonexistent")
    tr.classList.add("transition")
    setTimeout(() => {
        tr.classList.add("nonexistent")
        tr.classList.remove("transition")
    }, 500)
 
    
}

function emitWithResponse(channel, args){
    return new Promise((resolve, reject) => {
        window.electronAPI.emit(channel, args)
        window.electronAPI.handle(channel + "-res", (arg) => {
            resolve(arg)
        })

        setTimeout(() => {
            reject()
        }, 3000)
    })
}

function ready(){
    emitWithResponse("has-token").then(res => {
        const {code, token, status} = res;

        console.log("token mc status")
        if(code){
            if(token){
                updateStatus("prepmc")
            }else{
                updateStatus("postauth")
            }
        }else{
            if(access.username){
                updateStatus("prepmc")
            }else{
                updateStatus("preauthinfo")
            }
            
        }
        
    })
}

function processGlobals(){
    window.ready = ready;
    window.updateStatus = updateStatus;
}

processGlobals()

processnew()
//toggle()

updateStatus("start")
function update(info){
    console.info(info)
}

//console.log("starting proceses")
//window.electronAPI.emit("proc-begin")
document.getElementById("backgroundButton").addEventListener("click", hide)
document.getElementById("exitButton").addEventListener("click", close)
window.electronAPI.handle("update", update)
window.electronAPI.handle("test", () => {
    console.log("test")
})

window.electronAPI.handle("auth-show", () => {
    updateStatus("postAuth")
})

window.electronAPI.handle("auth-done", () => {
    if(state != "loadfail") ready()
})

window.electronAPI.handle("auth-close", (error) => {
    if(!error) ready()
    else{
        handleauthfail(error)
    }
})


function handleauthfail(error){
    let errorarray = []
    let done = false;

    let d = error.toString();
    d = d.substring(d.indexOf("Error") + 7)
    console.log(d)
    let e = d.split("")
    e.forEach(element => {
        if(element == " "){
            if(done) return;
            done = true;
            updateStatus("loadfail", {info: {innerHtml: "Loading the authorization page failed. The error is: " + errorarray.join("")}})
        }else{
            errorarray.push(element.toLowerCase())
        }
                
        
    });

    
}

function handlewebfail(error){

}



function handleusernotfound(){
    updateStatus("typeerror404")
}

function handlefastauthfailed(){
    console.log("Fast auth failed")
}

function handleminecraftclose(){
    console.log("Minecraft closed")
    updateStatus("prepmc")
}

function handleminecraftready(){
    console.log("Minecraft ready")
    updateStatus("launchmc")
}

function handleminecraftfail(error){
    console.log("Minecraft failed " + error)
}/*
function handlefastauthfailed(){
    updateStatus("typeerror404")
}*/


window.electronAPI.handle("wifi", (x) => {
    console.info(`Wifi status ${x}`)
    if(!x || x.toString().startsWith("Error:")){
        wifiFails++;
        if(wifiFails >= 3 && state != "errorunsolve"){
        updateStatus("wifilost")
        }
    }else{
        wifiFails = 0;
        if(state == "wifilost") ready();
        
    }
})


window.electronAPI.handle("proc-done", ready)
window.electronAPI.handle("ready", ready)
window.electronAPI.handle("mc-ready", handleminecraftready)
window.electronAPI.handle("mc-close", handleminecraftclose)
window.electronAPI.handle("mc-fail", handleminecraftfail)
//window.electronAPI.handle("ready", ready)
