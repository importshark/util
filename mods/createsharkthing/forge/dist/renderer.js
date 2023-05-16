"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const auth_png_1 = __importDefault(require("./assets/images/auth.png"));
const back_png_1 = __importDefault(require("./assets/images/back.png"));
const check_png_1 = __importDefault(require("./assets/images/check.png"));
const error_png_1 = __importDefault(require("./assets/images/error.png"));
const logo_png_1 = __importDefault(require("./assets/images/logo.png"));
const hide_png_1 = __importDefault(require("./assets/images/hide.png"));
const exit_png_1 = __importDefault(require("./assets/images/exit.png"));
const wifi_png_1 = __importDefault(require("./assets/images/wifi.png"));
const question_png_1 = __importDefault(require("./assets/images/question.png"));
const x_png_1 = __importDefault(require("./assets/images/x.png"));
const file_png_1 = __importDefault(require("./assets/images/file.png"));
const loading_gif_1 = __importDefault(require("./assets/images/loading.gif"));
const infinityloader_gif_1 = __importDefault(require("./assets/images/infinityloader.gif"));
const states_1 = require("./states");
require("./assets/css/index.css");
const states_types_1 = require("./types/states.types");
const actiondiv = document.getElementById("actiondiv");
let image = document.getElementById("shark");
let imageholder = document.getElementById("imgholder");
const infodiv = document.getElementById("infoholder");
let ofidiv = document.getElementById("ofidiv");
let ofi;
let info;
let child;
let wifiFails = 0;
//initialize csp tag
const csp = document.createElement("meta");
csp.setAttribute("http-equiv", "Content-Security-Policy");
csp.setAttribute("content", "default-src * blob: https: 'unsafe-eval' 'unsafe-inline' data:;");
(_a = document.querySelector("head")) === null || _a === void 0 ? void 0 : _a.appendChild(csp);
const access = {
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
    window.window.electronAPI.emit("window-hide", "hide");
}
function close() {
    console.log("[CLOSE alpha] event called.");
    window.electronAPI.emit("window-close", "close");
    window.close();
}
function buttonclick(element) {
    console.log(`[BTNCLICK BETA]${element} was clicked in state ${state}`);
    if (states_1.states[state].div.inttype != "button")
        return;
    switch (state) {
        case "error":
            updateStatus("start", false);
            break;
        case "preauth":
            switch (element) {
                case "child":
                    window.electronAPI.emit("auth-show");
                    updateStatus;
            }
            break;
        case "preauthinfo":
            switch (element) {
                case "child":
                    updateStatus("preauth", false);
                    break;
                case "ofi":
                    updateStatus("typetime", false);
                    break;
            }
            break;
        case "mcfail":
            switch (element) {
                case "child":
                    ready();
                    break;
                case "ofi":
                    updateStatus("error", false);
                    break;
            }
            break;
        case "launchmc":
            switch (element) {
                case "child":
                    updateStatus("launching", false);
                    break;
            }
            break;
        case "loadfail":
            switch (element) {
                case "child":
                    updateStatus("preauth", false);
                    break;
                case "ofi":
                    updateStatus("preauthinfo", false);
                    break;
            }
            break;
        case "checksave":
            switch (element) {
                case "child":
                    access.confirmed = "true";
                    window.electronAPI.emit("save-account", "true");
                    updateStatus("prepmc", false);
                    break;
                case "ofi":
                    access.confirmed = "true";
                    window.electronAPI.emit("save-account", "false");
                    ready();
                    break;
            }
            break;
        case "confirmfinish":
            switch (element) {
                case "child":
                    if (info === null || info === void 0 ? void 0 : info.innerHTML.startsWith("The account data was loaded")) {
                        //error!
                        ready();
                    }
                    else {
                        //success. send use account message and update status to prepmc
                        window.electronAPI.emit("use-account", "true");
                        ready();
                    }
                    break;
                case "ofi":
                    window.electronAPI.emit("use-account", "false");
                    //no need to call ready as that is handled by the use account function
                    break;
            }
            updateStatus("prepmc", false);
            break;
        case "confirmfail":
            switch (element) {
                case "child":
                    if (info === null || info === void 0 ? void 0 : info.innerHTML.startsWith("The account info failed to load, after three failed retries!")) {
                        return updateStatus("error", false);
                    }
                    else if (info === null || info === void 0 ? void 0 : info.innerHTML.startsWith("The account info failed to load")) {
                        return updateStatus("error", false);
                    }
                    ready();
                    break;
                case "ofi":
                    updateStatus("error", false);
                    break;
            }
            break;
        case "typetime":
            switch (element) {
                case "child":
                    if ((child === null || child === void 0 ? void 0 : child.innerText) == "-><-" || (child === null || child === void 0 ? void 0 : child.innerText.substring(2).trim()) == "<-")
                        return updateStatus("typeerror500", false);
                    else {
                        access.username = (child === null || child === void 0 ? void 0 : child.innerText) || "";
                        window.electronAPI.emit("set-user", access.username.substring(2, access.username.length - 2));
                        updateStatus("checksave", false);
                    }
                    break;
                case "ofi":
                    updateStatus("preauthinfo", false);
                    break;
            }
            break;
        case "typeerror404":
            updateStatus("typetime", false);
            break;
        case "typeerror500":
            updateStatus("typetime", false);
            break;
        case "autherror404":
            updateStatus("preauthinfo", false);
            break;
    }
}
let buttonmouseonlistener;
let buttonmouseofflistener;
let buttonmouseclicklistener;
let offhandclicklistener;
let refocusfuction = false;
function processnew() {
    const data = states_1.states[state];
    child = document.getElementById(data.child.id);
    ofi = document.getElementById(data.offhandicon.id);
    ofidiv = document.getElementById("ofidiv");
    image = document.getElementById(data.image.id);
    imageholder = document.getElementById(data.imagediv.id);
    info = document.getElementById(data.info.id);
    //console.log(buttonmouseonlistener)
    if (states_1.states[state].div.inttype == "button" && child)
        child.style.backgroundColor = "#00008b";
    if (states_1.states[state].div.inttype == "button" && !buttonmouseonlistener) {
        buttonmouseonlistener = true;
        child === null || child === void 0 ? void 0 : child.addEventListener("mouseenter", () => {
            if (states_1.states[state].div.inttype != "button")
                return;
            if (!child)
                return;
            child.style.backgroundColor = "#000075";
        });
        buttonmouseofflistener = true;
        child === null || child === void 0 ? void 0 : child.addEventListener("mouseleave", () => {
            if (states_1.states[state].div.inttype != "button")
                return;
            if (!child)
                return;
            child.style.backgroundColor = "#00008b";
        });
        buttonmouseclicklistener = true;
        child === null || child === void 0 ? void 0 : child.addEventListener("click", () => {
            console.log("[PROCESSNEW SNAIL] click event called");
            buttonclick("child");
        });
    }
    if (!data.offhandicon.class.includes("nonexistent") && !offhandclicklistener) {
        //is showing
        offhandclicklistener = true;
        if (ofi) {
            ofi.addEventListener("click", () => {
                buttonclick("ofi");
            });
        }
    }
    //get actions
    const actions = states_1.states[state].actions;
    console.log("[PROCNEW TREE] Running actions of state " + state);
    for (let i = 0; i < actions.length; i++) {
        const { action, value, extra } = actions[i];
        switch (action) {
            case "emit":
                switch (extra) {
                    case "username": {
                        //sending username
                        //remove helpers from username
                        const length = access.username.length;
                        const username = access.username.substring(2, length - 2);
                        window.electronAPI.emit(value, username);
                        break;
                    }
                    default: {
                        window.electronAPI.emit(value, extra);
                        break;
                    }
                    case "set": {
                        const key = value;
                        access[key] = extra;
                        break;
                    }
                }
        }
    }
    //process extra stuff for typetime
    const textbox = document.getElementById("userinput");
    if (state == "typetime")
        textbox === null || textbox === void 0 ? void 0 : textbox.focus();
    if (!refocusfuction) {
        refocusfuction = true;
        textbox === null || textbox === void 0 ? void 0 : textbox.addEventListener("blur", () => {
            console.log("[TYPETIME PROCNEW DEBUG] blur event");
            if (state != "typetime")
                return;
            textbox.focus();
        });
        textbox === null || textbox === void 0 ? void 0 : textbox.addEventListener("input", () => {
            if (state != "typetime")
                return;
            console.log("[TYPETIME PROCNEW DEBUG] input", textbox.value);
            if (!child)
                console.warn("Child doesn't exist? typetime text update");
            else {
                child.innerHTML = `->${textbox.value}<-`;
            }
        });
        textbox === null || textbox === void 0 ? void 0 : textbox.focus();
    }
}
function getIcon(ico) {
    let returnicon;
    switch (ico) {
        case states_types_1.icon.authicon:
            returnicon = auth_png_1.default;
            break;
        case states_types_1.icon.backicon:
            returnicon = back_png_1.default;
            break;
        case states_types_1.icon.checkicon:
            returnicon = check_png_1.default;
            break;
        case states_types_1.icon.erroricon:
            returnicon = error_png_1.default;
            break;
        case states_types_1.icon.logoicon:
            returnicon = logo_png_1.default;
            break;
        case states_types_1.icon.wifiicon:
            returnicon = wifi_png_1.default;
            break;
        case states_types_1.icon.fileicon:
            returnicon = file_png_1.default;
            break;
        case states_types_1.icon.question:
            returnicon = question_png_1.default;
            break;
        case states_types_1.icon.xicon:
            returnicon = x_png_1.default;
            break;
        case states_types_1.icon.loader:
            returnicon = loading_gif_1.default;
            break;
        case states_types_1.icon.inifinity:
            returnicon = infinityloader_gif_1.default;
            break;
    }
    return returnicon;
}
function _updateStatus(newstate, customdata) {
    console.log(`[UPDI PAIN] Updating state to ${newstate}`);
    const oldtype = states_1.states[state].div.type;
    child = document.getElementById(states_1.states[state].child.id);
    ofi = document.getElementById(states_1.states[state].offhandicon.id);
    const data = states_1.states[newstate];
    state = newstate;
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
    const bgbutton = document.getElementById("backgroundButton");
    const exitbutton = document.getElementById("exitButton");
    if (bgbutton)
        bgbutton.src = hide_png_1.default;
    if (exitbutton)
        exitbutton.src = exit_png_1.default;
    //actiondiv
    //remove all classes
    if (actiondiv) {
        actiondiv.className = "";
        //set classes to data
        for (let i = 0; i < data.div.class.length; i++) {
            const element = data.div.class[i];
            actiondiv.classList.add(element);
        }
    }
    else {
        console.warn("Actiondiv object does not seem to exist. Skipping state modifications!");
    }
    //child
    if (child) {
        child.className = "";
        //set classes to data
        switch (oldtype === data.div.type) {
            case true:
                for (let i = 0; i < data.child.class.length; i++) {
                    const element = data.child.class[i];
                    child.classList.add(element);
                }
                child.id = data.child.id;
                child.innerHTML = data.child.innerHtml;
                child.style.backgroundColor = "";
                break;
            case false: {
                child.remove();
                const newchild = document.createElement(data.div.type);
                for (let i = 0; i < data.child.class.length; i++) {
                    const element = data.child.class[i];
                    newchild.classList.add(element);
                }
                newchild.id = data.child.id;
                newchild.innerHTML = data.child.innerHtml;
                actiondiv === null || actiondiv === void 0 ? void 0 : actiondiv.appendChild(newchild);
                child = newchild;
                break;
            }
        }
        if (actiondiv) {
            if (data.child.div) {
                let found = false;
                for (let i = 0; i < (actiondiv.children).length; i++) {
                    const element = (actiondiv.children)[i];
                    if (element.id === states_1.states[state].child.id) {
                        found = true;
                    }
                }
                if (!found) {
                    actiondiv.appendChild(child);
                }
            }
            else {
                try {
                    actiondiv.removeChild(child);
                }
                catch (error) {
                    console.warn("Failed to remove child from actiondiv. This may be an error but most likely is normal operation.");
                }
                document.body.appendChild(child);
            }
        }
        else {
            console.warn("actiondiv does not seem to exist. Skipping div modifications for child!");
        }
    }
    else {
        console.warn("Child object does not seem to exist. Skipping state modifications!");
    }
    if (ofi) {
        //helpericon
        ofi.className = "";
        //set classes to data
        for (let i = 0; i < data.offhandicon.class.length; i++) {
            const element = data.offhandicon.class[i];
            ofi.classList.add(element);
        }
        ofi.id = data.offhandicon.id;
        //console.log("debugofi " + getIcon(data.offhandicon.src))
        if (typeof data.offhandicon.src == "string") {
            ofi.src = data.offhandicon.src;
        }
        else {
            ofi.src = getIcon(data.offhandicon.src);
        }
        ofi.alt = data.offhandicon.alt;
        if (ofidiv) {
            if (data.offhandicon.div) {
                let found = false;
                for (let i = 0; i < (ofidiv.children).length; i++) {
                    const element = (ofidiv.children)[i];
                    if (element.id === states_1.states[state].offhandicon.id) {
                        found = true;
                    }
                }
                if (!found) {
                    ofidiv.appendChild(ofi);
                }
            }
            else {
                try {
                    ofidiv.removeChild(ofi);
                }
                catch (error) {
                    console.warn("Failed to remove child from actiondiv. This may be an error but most likely is normal operation.");
                }
                document.body.appendChild(ofi);
            }
        }
        else {
            console.warn("OFI div does not seem to exist. Skipping div modifications for ofi!");
        }
    }
    else {
        console.warn("OFI object does not seem to exist. Skipping state modifications!");
    }
    if (imageholder) {
        //imageholder
        //remove all classes
        imageholder.className = "";
        //id and src
        imageholder.id = data.imagediv.id;
        //set classes to data
        for (let i = 0; i < data.imagediv.class.length; i++) {
            const element = data.imagediv.class[i];
            imageholder.classList.add(element);
        }
        if (data.image.div) {
            let found = false;
            for (let i = 0; i < (imageholder.children).length; i++) {
                const element = (imageholder.children)[i];
                if (element.id === states_1.states[state].image.id) {
                    found = true;
                }
            }
            if (!found) {
                imageholder.appendChild(image);
            }
        }
        else {
            try {
                image.removeChild(image);
            }
            catch (error) {
                console.warn("Failed to remove image from imageholder. This may be an error but most likely is normal operation.");
            }
            document.body.appendChild(image);
        }
    }
    //image
    //remove all classes
    if (info) {
        image.className = "";
        //id and src
        if (typeof data.image.src == "string") {
            image.src = data.image.src;
        }
        else {
            image.src = getIcon(data.image.src);
        }
        image.id = data.image.id;
        //set classes to data
        for (let i = 0; i < data.image.class.length; i++) {
            const element = data.image.class[i];
            image.classList.add(element);
        }
        //info
        //remove all classes
        info.className = "";
        //id and src
        info.id = data.info.id;
        info.innerHTML = data.info.innerHtml;
        //set classes to data
        for (let i = 0; i < data.info.class.length; i++) {
            const element = data.info.class[i];
            info.classList.add(element);
        }
        if (infodiv) {
            if (data.info.div) {
                let found = false;
                for (let i = 0; i < (infodiv.children).length; i++) {
                    const element = (infodiv.children)[i];
                    if (element.id === states_1.states[state].info.id) {
                        found = true;
                    }
                }
                if (!found) {
                    infodiv.appendChild(info);
                }
            }
            else {
                try {
                    infodiv.removeChild(info);
                }
                catch (error) {
                    console.warn("Failed to remove info from holder. This may be an error but most likely is normal operation.");
                }
                document.body.appendChild(info);
            }
        }
        else {
            console.warn("Info div does not seem to exist. Skipping div modifications for info!");
        }
    }
    else {
        console.warn("Info does not seem to exist. Skipping state modifications for info!");
    }
    //typetime clear input
    if (newstate == "typetime") {
        const tb = document.getElementById("userinput");
        if (tb)
            tb.value = "";
        tb === null || tb === void 0 ? void 0 : tb.focus();
    }
    processnew();
    console.log("[UPDI DEBUG PALE] State finished loading!");
}
function updateStatus(newstate, readystate, customdata) {
    // eslint-disable-next-line no-debugger
    //debugger;
    console.log(`[UPDA TUCK] Recieved update ${newstate}`);
    let modecover = true;
    if (state == newstate && readystate) {
        console.log("[UPDA CHECK DOOR] State is the same but ready is present so running with no cover");
        modecover = false;
    }
    console.log("[UPDA CHECK DOOR] Passed ready cover check");
    if (state == "beforestart") {
        console.log("[UPDA CHECK RULE] Current state is beforestart. Not loading cover.");
        modecover = false;
    }
    else if (state == newstate && !readystate) {
        return console.log("[UPDA CHECK SOAP] State is the same but ready is not present so exiting");
    }
    console.log("[UPDA CHECK LAME] Passed beforestart and dupe state check");
    if (!states_1.states[newstate]) {
        return console.log("[UPDA CHECK NONE] New state does not exist");
    }
    console.log("[UPDA CHECK NONE] Passed nonexistent state check");
    if (wifiFails >= 3 && newstate != "wifilost") {
        return console.log('[UPDA CHECK WIFI] Refusing to load new state because wifi is in fail state');
    }
    console.log("[UPDA CHECK WIFI] Passed wifi check");
    if (newstate == "start" && state != "beforestart") {
        console.log("[UPDA CHECK REED] Been directed to load start from a non startup state. Treating this as a ready request!");
        return ready();
    }
    console.log("[UPDA CHECK REED] Passed ready check");
    console.log("[UPDA CHECK DONE] loading said state");
    if (modecover) {
        //toggle()
        //setTimeout(() => {
        _updateStatus(newstate, customdata);
        // }, 250)
    }
    else
        _updateStatus(newstate, customdata);
}
function toggle() {
    const tr = document.getElementById("cover");
    if (!tr)
        return console.log("[TOGG CHECK COVE] Cover object does not exist!");
    tr === null || tr === void 0 ? void 0 : tr.classList.remove("nonexistent");
    tr === null || tr === void 0 ? void 0 : tr.classList.add("transition");
    setTimeout(() => {
        tr.classList.add("nonexistent");
        tr.classList.remove("transition");
    }, 500);
}
function emitWithResponse(channel, args) {
    return new Promise((resolve, reject) => {
        window.electronAPI.emit(channel, args);
        window.electronAPI.handle(channel + "-res", (arg) => {
            resolve(arg);
        });
        setTimeout(() => {
            reject();
        }, 3000);
    });
}
function setImage() {
    const element = document.getElementById("helpericon");
    if (element)
        element.src = "http://localhost:3001/logo.png";
}
function _getLink(url, blob) {
    // Create new promise with the Promise() constructor;
    // This has as its argument a function with two parameters, resolve and reject
    return new Promise(function (resolve, reject) {
        // Standard XHR to load an image
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = blob ? 'blob' : "json";
        // When the request loads, check whether it was successful
        request.onload = function () {
            if (request.status === 200) {
                // If successful, resolve the promise by passing back the request response
                resolve(request.response);
            }
            else {
                // If it fails, reject the promise with a error message
                reject(new Error('Image didn\'t load successfully; error code:' + request.statusText));
            }
        };
        request.onerror = function () {
            // Also deal with the case when the entire request fails to begin with
            // This is probably a network error, so reject the promise with an appropriate message
            reject(new Error('There was a network error.'));
        };
        // Send the request
        request.send();
    });
}
function getAvatar(user) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            //assume avatar get failed
            console.error("Avatar timed out. Resolving false");
            resolve(false);
        }, 3000);
        try {
            const username = (typeof user == "string") ? user : user.username;
            console.log("[AVAT DEBUG LAWN] Getting avatar of user ");
            console.log("[AVAT DEBUG USER] " + username);
            _getLink(`https://api.minetools.eu/uuid/${username}`, false).then(res => {
                clearTimeout(timeout);
                if (res instanceof Blob)
                    return console.log("[AVAT ERR RES] is blob ");
                if (res instanceof Response) {
                    res.json().then(y => {
                        console.log("[AVAT DEBUG UUID] Uuid api response json: ");
                        console.log(y);
                        if (!y.id) {
                            console.error("No id on response!");
                            clearTimeout(timeout);
                            resolve(false);
                        }
                        _getLink(`https://crafatar.com/avatars/${y.id}`, true).then(res2 => {
                            if (res2 instanceof Blob) {
                                const reader = new FileReader();
                                reader.readAsDataURL(res2);
                                reader.onloadend = function () {
                                    if (typeof reader.result != "string") {
                                        console.log("Reader result is not string? Result: /\\");
                                        console.log(reader.result);
                                        resolve(false);
                                        return;
                                    }
                                    resolve(reader.result);
                                };
                            }
                            else {
                                console.log("[AVAT ERR RES] is not blob!");
                                resolve(false);
                            }
                        });
                    }).catch(x => {
                        console.log("Error parsing json in avat! E: " + x);
                        resolve(false);
                    });
                }
                else {
                    console.log("[AVAT DEBUG UUID] Uuid api response json: ");
                    console.log(res);
                    if (!res.id) {
                        console.error("No id on response!");
                        clearTimeout(timeout);
                        resolve(false);
                    }
                    _getLink(`https://crafatar.com/avatars/${res.id}`, true).then(res2 => {
                        if (res2 instanceof Blob) {
                            const reader = new FileReader();
                            reader.readAsDataURL(res2);
                            reader.onloadend = function () {
                                if (typeof reader.result != "string") {
                                    console.log("Reader result is not string? Result: /\\");
                                    console.log(reader.result);
                                    resolve(false);
                                    return;
                                }
                                resolve(reader.result);
                            };
                        }
                        else {
                            console.log("[AVAT ERR RES] is not blob!");
                            resolve(false);
                        }
                    });
                }
            })
                .catch(x => {
                console.error("get avatar fetch catch failed. Eror: ");
                console.error(x);
                clearTimeout(timeout);
                resolve(false);
            });
        }
        catch (error) {
            console.error("[AVAT ERR DINE] get avatar + uuid outer function failed failed. Eror: " + error);
            clearTimeout(timeout);
            resolve(false);
        }
    });
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
    }
    catch (e) {
        //
    }
}
function checkMemoryEquals(data) {
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
        const data = res;
        console.log("[READ DEBUG LAKE] token mc status \\/");
        console.log(res);
        if (access.confirmed == "false") {
            if (data.memory.state == 3) {
                console.log("[READ DEBUG PARK] Data memory state thing is 3 and does not match");
                updateStatus("confirmacc", true);
                console.log('[READ DEBUG SAME] Set status. Proceeding to get the avatar.');
                return getAvatar(data.memory.username).then(x => {
                    if (!x) {
                        console.error("[AVAT ERR PORK] Could not load avatar. telling the user.");
                        const fails = Number(access.avatarfail);
                        if (typeof fails != "number") {
                            console.error("[AVAT ERR CORN] fails is not number? fails:");
                            console.info("[AVAT DEBUG CORN] " + fails);
                            return;
                        }
                        access.avatarfail = `${fails + 1}`;
                        if ((fails + 1) > 3) {
                            return updateStatus("confirmfail", true);
                        }
                        else {
                            return updateStatus("confirmfail", true, { info: {
                                    innerHtml: "The account info failed to load. You can try again below or continue without the save with the back button."
                                },
                                offhandicon: {
                                    class: ["helpericon"],
                                    src: states_types_1.icon.backicon
                                },
                                child: {
                                    innerHtml: "Retry"
                                }
                            });
                        }
                    }
                    let acc;
                    if (data.memory.state == 3)
                        acc = (typeof data.memory.username == "string") ? data.memory.username : data.memory.username.username;
                    else {
                        console.log("[AVAT DEBUG LAWN] Updating to preauthinfo");
                        return updateStatus("preauthinfo", true);
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
                            src: states_types_1.icon.backicon
                        }
                    });
                }).catch(x => {
                    console.log("[AVAT DEBUG PANE] Get avatar catch shouldnt be called: " + x);
                });
            }
        }
        //memory 0 not exist 1 not confirmed 2 not using 3 using
        if (data.auth.online == 0) {
            if (data.memory.state == 0 || data.memory.state == 1) {
                if (access.username) {
                    return updateStatus("checksave", true);
                }
                else {
                    return updateStatus("preauthinfo", true);
                }
            }
            else if (data.memory.state == 2) {
                if (access.username) {
                    return updateStatus("prepmc", true);
                }
                else {
                    return updateStatus("preauthinfo", true);
                }
            }
            else {
                if (access.username) {
                    return updateStatus("prepmc", true);
                }
                else {
                    return updateStatus("preauthinfo", true);
                }
            }
        }
        else {
            if (data.memory.state == 0 || data.memory.state == 1) {
                if (data.auth.state == 0)
                    return updateStatus("preauthinfo", true);
                else
                    return updateStatus("checksave", true);
            }
            else {
                if (data.auth.state == 0)
                    return updateStatus("preauthinfo", true);
                else
                    return updateStatus("prepmc", true);
            }
        }
    });
}
function test(act) {
    window.electronAPI.emit("test", act);
}
function processGlobals() {
    window.ready = ready;
    window.updateStatus = updateStatus;
    window.getAvatar = getAvatar;
    window.setImage = setImage;
    window.test = test;
}
processGlobals();
function update(info) {
    console.info(info);
}
//console.log("starting proceses")
//window.electronAPI.emit("proc-begin")
console.log("[MAIN DEBUG] Creating listeners...");
(_b = document.getElementById("backgroundButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", hide);
(_c = document.getElementById("exitButton")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", close);
window.electronAPI.handle("update", update);
window.electronAPI.handle("test", () => {
    console.log("[TEST DINO] test");
});
window.electronAPI.handle("auth-show", () => {
    updateStatus("postAuth", false);
});
window.electronAPI.handle("auth-done", (input) => {
    const use = input;
    console.log("Authdone with input " + use);
    if (!use) {
        return updateStatus("autherror404", false);
    }
    return updateStatus("checksave", false);
});
window.electronAPI.handle("auth-close", (error) => {
    console.log("[EV AUTO] Auth close");
    console.log(error);
    if (error.err) {
        console.log("[EV LONG] Auth close came back with err");
        return handleauthfail(error.err);
    }
    console.log("[MAIN DEBUG LORD] Auth closed successfully. Handling auth.");
    window.electronAPI.emit("auth-handle");
});
function handleauthfail(input) {
    console.log("[AUTF ERR]");
    console.log("[AUTF ERR] " + input);
    const error = String(input);
    const errorarray = [];
    let done = false;
    if (!error)
        return console.log("[AUTF ERR NAME] No err on auth fail!");
    let d = String(error);
    d = d.substring(d.indexOf("Error") + 7);
    const e = d.split("");
    e.forEach((element) => {
        if (element == " ") {
            if (done)
                return;
            done = true;
            updateStatus("loadfail", false, {
                info: {
                    innerHtml: "Loading the authorization page failed. The error is: " + errorarray.join("")
                }
            });
        }
        else {
            errorarray.push(element.toLowerCase());
        }
    });
}
function handleminecraftclose() {
    console.log("[MCLO NORM HOPE] Minecraft closed");
    updateStatus("prepmc", false);
}
function handleminecraftready() {
    console.log("[MCRE NORM YEET] Minecraft ready");
    updateStatus("launchmc", false);
}
function handleminecraftfail(error) {
    console.log("[MCCF NORM DORK] Minecraft failed " + error);
    if (error == "not-own")
        return updateStatus("autherror404", false);
    updateStatus("mcfail", false);
}
function handlebaseerror(error) {
    console.log("[BASE ERR POLE] Recieved error " + error);
    updateStatus("error", false, {
        info: {
            innerHtml: `An error has occured. The error is: ${error}`
        }
    });
}
/*
function handlefastauthfailed(){
    updateStatus("typeerror404")
}*/
window.electronAPI.handle("wifi", (x) => {
    if (!x || String(x).startsWith("Error:")) {
        wifiFails++;
        if (wifiFails >= 3 && state != "errorunsolve") {
            updateStatus("wifilost", false);
        }
    }
    else {
        wifiFails = 0;
        if (state == "wifilost")
            ready();
    }
});
window.electronAPI.handle("proc-done", ready);
window.electronAPI.handle("ready", ready);
window.electronAPI.handle("mc-ready", handleminecraftready);
window.electronAPI.handle("mc-close", handleminecraftclose);
window.electronAPI.handle("mc-fail", handleminecraftfail);
window.electronAPI.handle("error", handlebaseerror);
console.log("[MCLO NORM STAR] Listeners registered. Loading initial state.");
processnew();
//toggle()
updateStatus("start", false);
//# sourceMappingURL=renderer.js.map