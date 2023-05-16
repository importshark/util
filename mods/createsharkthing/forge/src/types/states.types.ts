export enum icon {
    authicon = 0,
        backicon = 1,
        checkicon = 2,
        erroricon = 3,
        logoicon = 4,
        wifiicon = 5,
        fileicon = 6,
        xicon = 7,
        question = 8,
        loader = 9,
        inifinity = 10
}



export interface statesobject {
    [key: string]: state
}

export interface partialstatesobject {
    [key: string]: Partial < state >
}

interface action {
    action: "emit" | "set",
    value: string,
    extra ? : unknown

}

export interface state {
    "div": {
        "type": string,
        "inttype": string,
        "class": string[]
    },
    "child": {
        "div": boolean,
        "class": string[],
        "id": string,
        "innerHtml": string
    },
    "offhandicon": {
        "id": string,
        "div": boolean,
        "class": string[],
        "src": icon | string,
        "alt": string
    },
    "info": {
        "div": true,
        "class": string[],
        "id": string,
        "innerHtml": string
    },
    "image": {
        "div": boolean,
        "class": string[],
        "src": icon | string,
        "alt": string,
        "id": string
    },
    "imagediv": {
        "class": string[],
        "id": string
    },
    "actions": action[]
}


export interface partialstate {
    "div" ? : {
        "type" ? : string,
        "inttype" ? : string,
        "class" ? : string[]
    },
    "child" ? : {
        "div" ? : boolean,
        "class" ? : string[],
        "id" ? : string,
        "innerHtml" ? : string
    },
    "offhandicon" ? : {
        "id" ? : string,
        "div" ? : boolean,
        "class" ? : string[],
        "src" ? : icon | string,
        "alt" ? : string
    },
    "info" ? : {
        "div" ? : true,
        "class" ? : string[],
        "id" ? : string,
        "innerHtml" ? : string
    },
    "image" ? : {
        "div" ? : boolean,
        "class" ? : string[],
        "src" ? : icon | string,
        "alt" ? : string,
        "id" ? : string
    },
    "imagediv" ? : {
        "class" ? : string[],
        "id" ? : string
    },
    "actions" ? : action[]
}