import {Compiler} from "webpack"
import css, {parse} from "css";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const PluginName = "ProcessCSSWebpack"

interface Options{
    css: string | string[],
    jsonemit: string,
    dir: string,
    timetochange: number,
    interval: number
}

interface ClassOptions{
    css: string | string[],
    jsonemit: string,
    dir?: string,
    timetochange?: number,
    interval?: number
}

function isRule(input: any): input is css.Rule {
    return ( < css.Rule > input)["type"] == "rule"
}


function isArray(input: any | any[]): input is any[] {
    const test1 = <Array<any>>input
    return test1["forEach"] !== undefined
}

function isDeclaration(input: any | any[]): input is css.Declaration | css.Declaration[] {

    if(!isArray(input)){
        //not array
        return ( < ModifiedDeclaration > input)["property"] !== undefined
    }else{
        //is array

        input.forEach(x => {
            if(!isDeclaration(x)) return false
        })
        return true;
    }
   
}


function isImportant(declaration: css.Declaration): boolean{
    if(declaration.property == "size") return true;
    if(declaration.property == "position") return true;
    if(declaration.property == "transform") return true;
    if(declaration.property == "margin") return true;
    if(declaration.property == "top") return true;
    if(declaration.property == "left") return true;
    if(declaration.property == "right") return true;
    if(declaration.property == "bottom") return true;
    if(declaration.property == "height") return true;
    if(declaration.property == "width") return true;
    if(declaration.property == "border-radius") return true;
    if(declaration.property == "opacity") return true;
    if(declaration.property == "background-color") return true;
    return false;

}

function isPropertyImportant(property: string): property is importantkeys{
    if(property == "size") return true;
    if(property == "position") return true;
    if(property == "transform") return true;
    if(property == "margin") return true;
    if(property == "top") return true;
    if(property == "left") return true;
    if(property == "right") return true;
    if(property == "bottom") return true;
    if(property == "height") return true;
    if(property == "width") return true;
    if(property == "border-radius") return true;
    if(property == "opacity") return true;
    if(property == "background-color") return true;
    return false;

}

type importantkeys = "top" |
    "left"|
    "right"|
    "bottom"|
    "opacity"|
    "color"

interface ModifiedDeclaration{

    property: importantkeys,
    value: string

}

interface OutputObject{
    rules: {[key: string]:  ModifiedDeclaration[]},
    time: number,
    interval: number
    
}

export default class ProcessCSSWebpackPlugin

{

    #options: Options
    constructor(options: ClassOptions){
        this.#options = {
            css: options.css,
            jsonemit: options.jsonemit,
            dir: options.dir || __dirname,
            timetochange: options.timetochange || 2,
            interval: options.interval || 2
        };
    }

    #constructJSONPath(): string{
        return join(this.#options.dir, this.#options.jsonemit)
    }
    
    #constructCSSPath(): string{
        if(typeof this.#options.css == "string"){
            return join(this.#options.dir, this.#options.css)
        }else{
            return ""//this.#options.css.map(x => join(this.#options.dir, x))
        }
        
    }

    apply(compiler: Compiler){
        compiler.hooks.beforeCompile.tap(PluginName, (compile) => {
                
            const csspath = this.#constructCSSPath()
            const cssdata = readFileSync(csspath).toString()

            const output: OutputObject = {
                time: this.#options.timetochange,
                interval: this.#options.interval,
                rules: {}
            }

            const css = parse(cssdata)
            
            if(!css.stylesheet) return;
            if(!css.stylesheet.rules) return;
           
            css.stylesheet.rules.forEach(x => {
                if(!isRule(x)) return;
                if(!x.selectors) return;

                if(!isDeclaration(x.declarations)) return;
                
                //mutate declaration for only important ones
                const first = x.declarations.filter(x => isImportant(x))
                //mutate declaration for only key and value
                const declarations: ModifiedDeclaration[] = []
                first.forEach(y=> {
                    if(!isDeclaration(y)) return;
                    if(!y) return;
                    if(!y.property) return;
                    if(!y.value) return;
                    if(!isPropertyImportant(y.property)) return;
                    
                    declarations.push({property: y.property,
                    value: y.value
                })
                })


                if(declarations.length == 0) return;

                if(x.selectors.length <= 1){
                    output.rules[x.selectors[0].replace(".", "").replace("#", "")] = declarations
                }else{
                    x.selectors.forEach(y => {
                        if(!isDeclaration(declarations)) return;
                        output.rules[y.replace(".", "").replace("#", "")] = declarations
                    })
                }
            })

            writeFileSync(this.#options.jsonemit, JSON.stringify(output, null, 2))

            

        })

    }   
}

//sharp module will be able to do images