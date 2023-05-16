import {
    EventEmitter
} from "events"
import {
    OwnsGameFastAuth,
    NotOwnsGameFastAuth,
    FastAuthError
} from "./auth.types"
import {
    MemoryAA,
    MemoryAB,
    StrippedMemory,
    Memory,
    ParsedMemory
} from "../util";



export type threeenum = 0 | 1 | 2

export class varlistener < T > {
    #listener: EventEmitter;
    value ? : T;
    constructor(basevalue ? : T) {
        this.#listener = new EventEmitter()
        this.value = basevalue;
    }
    set(newvalue: T) {
        this.#listener.emit("change", this.value, newvalue)
        this.value = newvalue
    }
    get() {
        return this.value;
    }
    addListener(listenerfunction: (value: T, newvalue: T) => any) {
        this.#listener.once("change", listenerfunction)
    }
}


export interface BeforeOfflineAuthObject {

    state: 0,
    online: 0
}

export interface OfflineAuthObject {


    username: string,
    state: 1,
    online: 0
}

export interface OnlineAuthObject {
    code: string,
    result ? : OwnsGameFastAuth | NotOwnsGameFastAuth | FastAuthError,
    online: 1,
    state: 1
}

export interface FinishedOnlineAuthObject {
    code: string,
    result: OwnsGameFastAuth | NotOwnsGameFastAuth | FastAuthError,
    online: 1,
    state: 2
}
export interface BeforeOnlineAuthObject {
    online: 1,
    state: 0
}

export type AuthObject = BeforeOfflineAuthObject | OfflineAuthObject | OnlineAuthObject | FinishedOnlineAuthObject | BeforeOnlineAuthObject

function isAuthMemory(input: MemoryAA | MemoryAB): input is MemoryAB {
    const object = < MemoryAB > input
    return object["auth"] !== undefined;
}

function isOnlineData(input: string | OwnsGameFastAuth): input is OwnsGameFastAuth {
    const object = < OwnsGameFastAuth > input
    let returnvalue = false;
    try {
        if (object["access_token"]) returnvalue = true;
        else returnvalue = false;
    } catch (e) {
        console.warn("IsOnlineData failed with e: " + e + ". Assuming it is not OwnsGameFastAuth")
        returnvalue = false;
    }
    return returnvalue;


}

export function stripData(data: ParsedMemory): StrippedMemory {

    switch (data.state) {
        case 0:
            return {
                state: data.state

            }
            break;
        case 1:
            return {
                state: data.state

            }
            break;
        case 2:
            return {
                state: data.state

            }
            break;
        case 3:
            if (isOnlineData(data.auth)) {
                return {
                    state: data.state,
                    auth: !!data.auth,
                    online: 1,
                    username: data.auth.username
                }
            } else {
                return {
                    state: data.state,
                    auth: !!data.auth,
                    online: 0,
                    username: data.auth

                }
            }
            break;
    }


}

export function evalMemory(data: Memory | false): ParsedMemory {

    if (!data) {
        return {
            state: 0
        }
    }

    if (data.save) {

        if (isAuthMemory(data)) {
            return {
                auth: data.auth.auth || data.auth,
                online: 1,
                state: 3
            }
        } else {
            return {
                auth: data.username,
                state: 3,
                online: 0
            }
        }
    } else {

        return {
            state: 2
        }
    }

}