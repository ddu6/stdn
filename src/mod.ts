import * as ston from 'ston'
export type STDNChar=string
export type STDNUnitOptions={
    [key:string]:STDN|string|number|boolean|undefined
}
export interface STDNUnit{
    tag:string
    children:STDN
    options:STDNUnitOptions
}
export type STDNInline=STDNUnit|STDNChar
export type STDNLine=STDNInline[]
export type STDN=STDNLine[]
export type STDNUnitObject={
    [key:string]:STDNArray|{__:STDNArray|string}|string|number|boolean|undefined
}
export type STDNInlineSTON=STDNUnitObject|string
export type STDNLineSTON=STDNInlineSTON[]|STDNInlineSTON
export type STDNArray=STDNLineSTON[]
function objectToUnit(object:ston.STONObject){
    let tag='div'
    let children:STDN=[]
    let options:STDNUnitOptions={}
    for(const key of Object.keys(object)){
        let val=object[key]
        if(val===undefined){
            continue
        }
        if(key==='__'){
            if(!Array.isArray(val)){
                val=[val]
            }
            tag='katex'
            children=arrayToSTDN(val)
            continue
        }
        if(Array.isArray(val)){
            tag=key
            children=arrayToSTDN(val)
            continue
        }
        if(typeof val==='object'){
            val=val.__
            if(val===undefined){
                continue
            }
            if(typeof val==='string'){
                val=[{__:val}]
            }else if(!Array.isArray(val)){
                val=[val]
            }
            options[key]=arrayToSTDN(val)
            continue
        }
        options[key]=val
    }
    return {
        tag,
        children,
        options
    }
}
function arrayToLine(array:ston.STONArray){
    const out:STDNLine=[]
    for(const item of array){
        if(typeof item==='string'){
            for(const char of item){
                if(char>=' '){
                    out.push(char)
                }
            }
            continue
        }
        if(typeof item==='object'&&!Array.isArray(item)){
            out.push(objectToUnit(item))
        }
    }
    return out
}
function arrayToSTDN(array:ston.STONArray){
    const out:STDN=[]
    for(const item of array){
        if(!Array.isArray(item)){
            out.push(arrayToLine([item]))
            continue
        }
        out.push(arrayToLine(item))
    }
    return out
}
export function parse(string:string){
    const array=ston.parse('['+string+']')
    if(!Array.isArray(array)){
        return undefined
    }
    return arrayToSTDN(array)
}
function unitToObject(unit:STDNUnit){
    const out:STDNUnitObject={}
    const {tag,children,options}=unit
    for(const key of Object.keys(options)){
        let val=options[key]
        if(typeof val!=='object'){
            out[key]=val
            continue
        }
        out[key]={__:stdnToArrayOrKString(val)}
    }
    if(tag==='katex'){
        out.__=stdnToArrayOrString(children)
    }else if(tag!=='div'||children.length>0){
        out[tag]=stdnToArray(children)
    }
    return out
}
function lineToSTON(line:STDNLine){
    const out:STDNInlineSTON[]=[]
    let string=''
    for(const inline of line){
        if(typeof inline==='object'){
            if(string.length>0){
                out.push(string)
                string=''
            }
            out.push(unitToObject(inline))
            continue
        }
        string+=inline
    }
    if(string.length>0){
        out.push(string)
    }
    if(out.length===1){
        return out[0]
    }
    return out
}
function stdnToArray(stdn:STDN){
    const out:STDNArray=[]
    for(const line of stdn){
        out.push(lineToSTON(line))
    }
    return out
}
function stdnToArrayOrString(stdn:STDN){
    const array=stdnToArray(stdn)
    if(array.length===1){
        const item=array[0]
        if(typeof item==='string'){
            return item
        }
    }
    return array
}
function stdnToArrayOrKString(stdn:STDN){
    const array=stdnToArray(stdn)
    if(array.length===1){
        const item=array[0]
        if(typeof item==='object'&&!Array.isArray(item)){
            const keys=Object.keys(item)
            if(keys.length===1&&keys[0]==='__'){
                const val=item.__
                if(typeof val==='string'){
                    return val
                }
            }
        }
    }
    return array
}
export function stringify(stdn:STDN|undefined){
    if(stdn===undefined){
        return ''
    }
    return ston.stringify(stdnToArray(stdn),{
        indentLevel:-1,
        indentTarget:'arrayInObjectAndThis',
        addDecorativeComma:'inObject',
        addDecorativeSpace:'always',
        useUnquotedString:true,
    }).slice(2,-2)
}
export function format(string:string){
    const result=ston.parseWithIndex('['+string+']')
    if(result===undefined){
        return string
    }
    return ston.stringifyWithComment(result.value,{
        indentLevel:-1,
        indentTarget:'arrayInObjectAndThis',
        addDecorativeComma:'inObject',
        addDecorativeSpace:'always',
        useUnquotedString:true,
    }).slice(2,-2)
}