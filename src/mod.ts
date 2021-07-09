import * as ston from 'ston'
export type STDNChar=string
export type STDNUnitOptions={
    [key:string]:STDN|string|number|boolean
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
    [key:string]:STDNArray|{__:STDNArray|string}|string|number|boolean
}
export type STDNInlineSTON=STDNUnitObject|string
export type STDNLineSTON=STDNInlineSTON[]|STDNInlineSTON
export type STDNArray=STDNLineSTON[]
function objectToUnit(object:ston.STONObject){
    let tag='div'
    let children:STDN=[]
    let options:STDNUnitOptions={}
    const keys=Object.keys(object)
    for(const key of keys){
        let val=object[key]
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
    for(let i=0;i<array.length;i++){
        const item=array[i]
        if(typeof item==='string'){
            for(let i=0;i<item.length;i++){
                const char=item[i]
                if(char>=' '){
                    out.push(char)
                }
            }
            continue
        }
        if(Array.isArray(item)||typeof item!=='object'){
            continue
        }
        out.push(objectToUnit(item))
    }
    return out
}
function arrayToSTDN(array:ston.STONArray){
    const out:STDN=[]
    for(let i=0;i<array.length;i++){
        let item=array[i]
        if(typeof item==='string'){
            const result=item.split('\n')
            for(let i=0;i<result.length;i++){
                out.push(arrayToLine([result[i]]))
            }
            continue
        }
        if(!Array.isArray(item)){
            item=[item]
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
    const keys=Object.keys(options)
    for(const key of keys){
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
    for(let i=0;i<line.length;i++){
        const inline=line[i]
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
    for(let i=0;i<stdn.length;i++){
        out.push(lineToSTON(stdn[i]))
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
    const array:string[]=[]
    for(let i=0;i<stdn.length;i++){
        array.push(ston.stringify(lineToSTON(stdn[i]),{
            indentTarget:'arrayInObject',
            addDecorativeComma:'inObject'
        }))
    }
    return array.join('\n')
}