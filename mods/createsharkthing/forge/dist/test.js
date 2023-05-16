"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const css = __importStar(require("css"));
const cssdir = "D:\\Projects\\Misc\\util\\mods\\createsharkthing\\forge\\src\\assets\\css\\";
const keepinmemory = process.argv[2] == "false" || true;
let filestring = "";
//get css directory files
const files = (0, fs_1.readdirSync)(cssdir);
//get file data anf build structure
for (let i = 0; i < files.length; i++) {
    const element = files[i];
    const file = (0, path_1.join)(cssdir, element);
    const filedata = (0, fs_1.readFileSync)(file).toString(); //.replace(" ", "")
    if (keepinmemory) {
        filestring += filedata;
    }
    else {
        (0, fs_1.appendFileSync)((0, path_1.join)(__dirname, "merge.css"), filedata);
    }
    //const cssdata = css.parse(filedata).stylesheet?.rules.filter(x => x.type == "rule")
}
console.log("Done amassing data. Crunching potato chips.");
let cssdata;
if (keepinmemory) {
    cssdata = ((_a = css.parse(filestring).stylesheet) === null || _a === void 0 ? void 0 : _a.rules /*.filter(isRule)*/) || [];
}
else {
    cssdata = ((_b = css.parse((0, fs_1.readFileSync)((0, path_1.join)(__dirname, "merge.css")).toString()).stylesheet) === null || _b === void 0 ? void 0 : _b.rules /*.filter(isRule) */) || [];
}
function isRule(input) {
    return input["type"] == "rule";
}
function isKeyFrame(input) {
    return true;
}
function isDeclaration(input) {
    return input["property"] !== undefined;
}
const array = [];
cssdata === null || cssdata === void 0 ? void 0 : cssdata.forEach((value) => {
    console.log(value.type);
    if (value.type == "keyframes") {
        if (isKeyFrame(value) && !isRule(value)) {
            const x = value["keyframes"][0];
            console.log(x["declarations"][0]);
            throw new Error("done");
        }
    }
    cssdata === null || cssdata === void 0 ? void 0 : cssdata.forEach((v) => {
        var _a, _b;
        if (!v.selectors || ((_a = v.selectors) === null || _a === void 0 ? void 0 : _a.length) <= 0)
            return;
        if (!value.selectors || ((_b = value.selectors) === null || _b === void 0 ? void 0 : _b.length) <= 0)
            return;
        const dec = v.declarations;
        if (!dec) {
            return console.info("Skipping");
        }
        const newdec = [];
        dec.forEach(x => {
            if (isDeclaration(x)) {
                newdec.push(x);
            }
        });
        //console.log(newdec)
        array.push({
            from: value.selectors[0],
            to: v.selectors[0],
        });
    });
});
console.log("Done creating links");
for (let i = 0; i < array.length; i++) {
    const element = array[i];
    //get from data
    const from = cssdata.find(x => {
        if (!x.selectors || !x.selectors[0])
            return false;
        return x.selectors[0] == element.from;
    });
    const to = cssdata.find(x => {
        if (!x.selectors || !x.selectors[0])
            return false;
        return x.selectors[0] == element.to;
    });
    //create keyframes
    /*const animation: css.KeyFrames = {
        type: 'keyframes',
        name: 'transition',
        keyframes: [
  {
    type: 'keyframe',
    values: [ '0%' ],
    declarations:  [{
      type: 'declaration',
      property: 'transform',
      value: 'scale(1)',
      position: [Position]
    },
    {
      type: 'declaration',
      property: 'opacity',
      value: '0',
      position: [Position]
    }],
    position: Position { start: [Object], end: [Object], source: undefined }
  },
  
],
        position: Position {
          start: { line: 213, column: 1 },
          end: { line: 230, column: 2 },
          source: undefined
        }
      }*/
}
//# sourceMappingURL=test.js.map