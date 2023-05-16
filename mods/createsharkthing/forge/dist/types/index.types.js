"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _varlistener_listener;
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalMemory = exports.stripData = exports.varlistener = void 0;
const events_1 = require("events");
class varlistener {
    constructor(basevalue) {
        _varlistener_listener.set(this, void 0);
        __classPrivateFieldSet(this, _varlistener_listener, new events_1.EventEmitter(), "f");
        this.value = basevalue;
    }
    set(newvalue) {
        __classPrivateFieldGet(this, _varlistener_listener, "f").emit("change", this.value, newvalue);
        this.value = newvalue;
    }
    get() {
        return this.value;
    }
    addListener(listenerfunction) {
        __classPrivateFieldGet(this, _varlistener_listener, "f").once("change", listenerfunction);
    }
}
exports.varlistener = varlistener;
_varlistener_listener = new WeakMap();
function isAuthMemory(input) {
    const object = input;
    return object["auth"] !== undefined;
}
function isOnlineData(input) {
    const object = input;
    let returnvalue = false;
    try {
        if (object["access_token"])
            returnvalue = true;
        else
            returnvalue = false;
    }
    catch (e) {
        console.warn("IsOnlineData failed with e: " + e + ". Assuming it is not OwnsGameFastAuth");
        returnvalue = false;
    }
    return returnvalue;
}
function stripData(data) {
    switch (data.state) {
        case 0:
            return {
                state: data.state
            };
            break;
        case 1:
            return {
                state: data.state
            };
            break;
        case 2:
            return {
                state: data.state
            };
            break;
        case 3:
            if (isOnlineData(data.auth)) {
                return {
                    state: data.state,
                    auth: !!data.auth,
                    online: 1,
                    username: data.auth.username
                };
            }
            else {
                return {
                    state: data.state,
                    auth: !!data.auth,
                    online: 0,
                    username: data.auth
                };
            }
            break;
    }
}
exports.stripData = stripData;
function evalMemory(data) {
    if (!data) {
        return {
            state: 0
        };
    }
    if (data.save) {
        if (isAuthMemory(data)) {
            return {
                auth: data.auth.auth || data.auth,
                online: 1,
                state: 3
            };
        }
        else {
            return {
                auth: data.username,
                state: 3,
                online: 0
            };
        }
    }
    else {
        return {
            state: 2
        };
    }
}
exports.evalMemory = evalMemory;
//# sourceMappingURL=index.types.js.map