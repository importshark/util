"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPath = void 0;
//import * as pug from "pug"
const path_1 = require("path");
function getPath(file, type) {
    console.log((0, path_1.join)(__dirname, "..", "..", "src", "assets", type, file));
    return (0, path_1.join)(__dirname, "..", "..", "assets", type, file);
}
exports.getPath = getPath;
/*
export function getView(view: string, data: ViewParams) {
    let template = pug.compileFile(getPath(view, "image"))
    return template(data)
}*/ 
//# sourceMappingURL=assetloader.js.map