import {
    StrippedMemory
} from "../util"

export interface hastokenresposnseonlinestate0 {
    auth: {
        state: 0,
        online: 1,
    },
    memory: StrippedMemory,
    status: 0 | 1 | 2
}

export interface hastokenresposnseoffline {
    auth: {
        state: 0,
        online: 0,
    },
    memory: StrippedMemory,
    status: 0 | 1 | 2
}

export interface hastokenresposnseofflinefinish {

    memory: StrippedMemory,
    auth: {
        username: string,
        state: 1,
        online: 0
    },
    status: 0 | 1 | 2
}

export interface hastokenresposnseonline {
    auth: {
        state: 1,
        online: 1,
        code: boolean
    },
    memory: StrippedMemory,
    status: 0 | 1 | 2
}

export interface hastokenresposnseonlinefinish {
    auth: {
        state: 2,
        online: 1,

        code: boolean,
        result: boolean
    },
    memory: StrippedMemory,
    status: 0 | 1 | 2
}
export type hastokenresposnse = hastokenresposnseoffline | hastokenresposnseofflinefinish | hastokenresposnseonline | hastokenresposnseonlinefinish | hastokenresposnseonlinestate0