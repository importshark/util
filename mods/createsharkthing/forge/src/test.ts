import {
    appendFileSync,
    readFileSync,
    readdirSync
} from "fs";
import {
    join
} from "path";
import * as css from "css"
const cssdir = "D:\\Projects\\Misc\\util\\mods\\createsharkthing\\forge\\src\\assets\\css\\"

type PositionType = "absolute" | "sticky" | "relative" | "fixed" | "static" | "inherit" | "initial" | "unset"

type ClassKeys = "size" | "position" | "height" | "width"

type search = "key" | "value" | "name" | "none"

interface Class {
    keys: string[],
    values: string[],
    name: any,
    class: boolean
}


const keepinmemory = process.argv[2] == "false" || true
let filestring = ""


//get css directory files
const files = readdirSync(cssdir)


//get file data anf build structure


for (let i = 0; i < files.length; i++) {
    const element = files[i];
    const file = join(cssdir, element)

    const filedata = readFileSync(file).toString() //.replace(" ", "")
    if (keepinmemory) {
        filestring += filedata;
    } else {
        appendFileSync(join(__dirname, "merge.css"), filedata)
    }
    //const cssdata = css.parse(filedata).stylesheet?.rules.filter(x => x.type == "rule")

}

console.log("Done amassing data. Crunching potato chips.")
let cssdata: css.Rule[];

if (keepinmemory) {
    cssdata = css.parse(filestring).stylesheet?.rules /*.filter(isRule)*/ || []
} else {
    cssdata = css.parse(readFileSync(join(__dirname, "merge.css")).toString()).stylesheet?.rules /*.filter(isRule) */ || []

}

function isRule(input: any): input is css.Rule {
    return ( < css.Rule > input)["type"] == "rule"
}

function isKeyFrame(input: any): input is css.KeyFrames {
    return true
}

function isDeclaration(input: any): input is css.Declaration {
    return ( < css.Declaration > input)["property"] !== undefined
}

type DataData = {
    [key in ClassKeys]: string;
};

interface Data {
    from: string,
    to: string,
    data ? : DataData
}

const array: Data[] = []

cssdata?.forEach((value) => {
    console.log(value.type)
    if (value.type == "keyframes") {
        if (isKeyFrame(value) && !isRule(value)) {
            const x = value["keyframes"][0]
            console.log(x["declarations"][0])
            throw new Error("done")
        }

    }

    cssdata?.forEach((v) => {
        if (!v.selectors || v.selectors?.length <= 0) return;
        if (!value.selectors || value.selectors?.length <= 0) return;

        const dec = v.declarations
        if (!dec) {
            return console.info("Skipping")
        }


        const newdec: css.Declaration[] = []

        dec.forEach(x => {
            if (isDeclaration(x)) {
                newdec.push(x)
            }
        })

        //console.log(newdec)



        array.push({
            from: value.selectors[0],
            to: v.selectors[0],
        })
    })


})

console.log("Done creating links")

/*
{
    type: 'keyframe',
    values: [ '0%' ],
    declarations:  [{
      type: 'declaration',
      property: 'transform',
      value: 'scale(1)',
      position: {
        start: { line: 215, column: 5 },
        end: { line: 215, column: 24 }
      }
    },
    {
      type: 'declaration',
      property: 'opacity',
      value: '0',
      position: {
        start: { line: 215, column: 5 },
        end: { line: 215, column: 24 }
      }
    }
    */

for (let i = 0; i < array.length; i++) {
    const element = array[i];
    //get from data


    const from = cssdata.find(x => {
        if (!x.selectors || !x.selectors[0]) return false;
        return x.selectors[0] == element.from;
    })
    const to = cssdata.find(x => {
        if (!x.selectors || !x.selectors[0]) return false;
        return x.selectors[0] == element.to;
    })

    if (!from || !to) continue;
    //create keyframes
    const animation: css.KeyFrames = {
        type: 'keyframes',
        name: `${element.from}-${element.to}`,
        keyframes: []
    }
}