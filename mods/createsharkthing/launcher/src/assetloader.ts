import * as pug from "pug"
import {
    join
} from "path"


type File = "audio" | "css" | "font" | "html" | "image" | "js" | "other" | "view"

interface ViewParams {
    [key: string]: string | number
}

export function getPath(file: string, type: File) {
    console.log(join(__dirname, "..", "..", "assets", type, file))
    return join(__dirname, "..", "..", "assets", type, file)

}

export function getView(view: string, data: ViewParams) {
    let template = pug.compileFile(getPath(view, "image"))
    return template(data)
}