export type STONObject={
    [key:string]:STON
}
export type STONObjectValueWithIndex={
    [key:string]:STONWithIndex
}
export type STONArray=STON[]
export type STONArrayValueWithIndex=STONWithIndex[]
export type STON=STONObject|STONArray|string|number|boolean
export type STONValueWithIndex=STONObjectValueWithIndex|STONArrayValueWithIndex|string|number|boolean
export type STONWithIndex={
    value:STONValueWithIndex
    index:number
}
function splitToArrayWithIndex(string:string,index:number,keepKey=false){
    let count=0
    let quote=false
    let escape=false
    let last=0
    let comment:false|'line'|'block'=false
    const array:{value:string,index:number}[]=[]
    for(let i=0;i<string.length;i++){
        if(escape===true){
            escape=false
            continue
        }
        const char=string[i]
        if(comment==='line'){
            if(char==='\n'){
                comment=false
            }
            last=i+1
            continue
        }
        if(comment==='block'){
            if(char==='*'){
                const next=string[i+1]
                if(next==='/'){
                    i++
                    comment=false
                }
            }
            last=i+1
            continue
        }
        if(char==="'"){
            if(!quote){
                quote=true
                if(count===0&&!keepKey){
                    const tmp=string.slice(last,i).trimEnd()
                    if(tmp!==''){
                        array.push({
                            value:tmp,
                            index:index+last
                        })
                    }
                    last=i
                }
                continue
            }
            quote=false
            if(count===0){
                array.push({
                    value:string.slice(last,i+1),
                    index:index+last
                })
                last=i+1
            }
            continue
        }
        if(quote){
            if(char==='\\'){
                escape=true
                continue
            }
            continue
        }
        if(char==='{'||char==='['){
            count++
            if(count===1&&!keepKey){
                const tmp=string.slice(last,i).trimEnd()
                if(tmp!==''){
                    array.push({
                        value:tmp,
                        index:index+last
                    })
                }
                last=i
            }
            continue
        }
        if(char==='}'||char===']'){
            count--
            if(count<0){
                const tmp=string.slice(last,i).trimEnd()
                if(tmp!==''){
                    array.push({
                        value:tmp,
                        index:index+last
                    })
                }
                break
            }
            if(count===0){
                array.push({
                    value:string.slice(last,i+1),
                    index:index+last
                })
                last=i+1
            }
            continue
        }
        if(count>0){
            continue
        }
        if(char===','||char==='\n'){
            const tmp=string.slice(last,i).trimEnd()
            if(tmp!==''){
                array.push({
                    value:tmp,
                    index:index+last
                })
            }
            last=i+1
            continue
        }
        if(last<i){
            continue
        }
        if(char.trimEnd()===''){
            last=i+1
            continue
        }
        if(char==='/'){
            const next=string[i+1]
            if(next==='/'){
                i++
                comment='line'
                last=i+1
                continue
            }
            if(next==='*'){
                i++
                comment='block'
                last=i+1
                continue
            }
        }
    }
    if(!quote&&count===0){
        const tmp=string.slice(last).trimEnd()
        if(tmp!==''){
            array.push({
                value:tmp,
                index:index+last
            })
        }
    }
    return array
}
function splitToArray(string:string,keepKey=false){
    let count=0
    let quote=false
    let escape=false
    let last=0
    let comment:false|'line'|'block'=false
    const array:string[]=[]
    for(let i=0;i<string.length;i++){
        if(escape===true){
            escape=false
            continue
        }
        const char=string[i]
        if(comment==='line'){
            if(char==='\n'){
                comment=false
            }
            last=i+1
            continue
        }
        if(comment==='block'){
            if(char==='*'){
                const next=string[i+1]
                if(next==='/'){
                    i++
                    comment=false
                }
            }
            last=i+1
            continue
        }
        if(char==="'"){
            if(!quote){
                quote=true
                if(count===0&&!keepKey){
                    const tmp=string.slice(last,i).trimEnd()
                    if(tmp!==''){
                        array.push(tmp)
                    }
                    last=i
                }
                continue
            }
            quote=false
            if(count===0){
                array.push(string.slice(last,i+1))
                last=i+1
            }
            continue
        }
        if(quote){
            if(char==='\\'){
                escape=true
                continue
            }
            continue
        }
        if(char==='{'||char==='['){
            count++
            if(count===1&&!keepKey){
                const tmp=string.slice(last,i).trimEnd()
                if(tmp!==''){
                    array.push(tmp)
                }
                last=i
            }
            continue
        }
        if(char==='}'||char===']'){
            count--
            if(count<0){
                const tmp=string.slice(last,i).trimEnd()
                if(tmp!==''){
                    array.push(tmp)
                }
                break
            }
            if(count===0){
                array.push(string.slice(last,i+1))
                last=i+1
            }
            continue
        }
        if(count>0){
            continue
        }
        if(char===','||char==='\n'){
            const tmp=string.slice(last,i).trimEnd()
            if(tmp!==''){
                array.push(tmp)
            }
            last=i+1
            continue
        }
        if(last<i){
            continue
        }
        if(char.trimEnd()===''){
            last=i+1
            continue
        }
        if(char==='/'){
            const next=string[i+1]
            if(next==='/'){
                i++
                comment='line'
                last=i+1
                continue
            }
            if(next==='*'){
                i++
                comment='block'
                last=i+1
                continue
            }
        }
    }
    if(!quote&&count===0){
        const tmp=string.slice(last).trimEnd()
        if(tmp!==''){
            array.push(tmp)
        }
    }
    return array
}
function tempArrayToSTONArrayValueWithIndex(array:{value:string,index:number}[]){
    const out:STONArrayValueWithIndex=[]
    for(let i=0;i<array.length;i++){
        const {value,index}=array[i]
        const ston=parseWithIndex(value,index)
        if(ston===undefined){
            return undefined
        }
        out.push(ston)
    }
    return out
}
function tempArrayToSTONArray(array:string[]){
    const out:STONArray=[]
    for(let i=0;i<array.length;i++){
        const ston=parse(array[i])
        if(ston===undefined){
            return undefined
        }
        out.push(ston)
    }
    return out
}
function tempArrayToSTONObjectValueWithIndex(array:{value:string,index:number}[]){
    const out:STONObjectValueWithIndex={}
    for(let i=0;i<array.length;i++){
        const {value,index}=array[i]
        const result=value.match(/^\s*([\w-]+)/)
        if(result===null){
            const ston=parseWithIndex(value,index)
            if(ston===undefined){
                return undefined
            }
            out.__=ston
            continue
        }
        const key=result[1]
        const length=result[0].length
        let valStr=value.slice(length).trimEnd()
        if(valStr===''){
            out[key]={
                value:true,
                index:index+length
            }
        }else{
            const value=parseWithIndex(valStr,index+length)
            if(value===undefined){
                return undefined
            }
            out[key]=value
        }
    }
    return out
}
function tempArrayToSTONObject(array:string[]){
    const out:STONObject={}
    for(let i=0;i<array.length;i++){
        const string=array[i]
        const result=string.match(/^\s*([\w-]+)/)
        if(result===null){
            const ston=parse(string)
            if(ston===undefined){
                return undefined
            }
            out.__=ston
            continue
        }
        const key=result[1]
        const length=result[0].length
        let valStr=string.slice(length).trimEnd()
        if(valStr===''){
            out[key]=true
        }else{
            const value=parse(valStr)
            if(value===undefined){
                return undefined
            }
            out[key]=value
        }
    }
    return out
}
function parseToString(string:string){
    const array:string[]=[]
    let escape:boolean=false
    for(let i=0;i<string.length;i++){
        const char=string[i]
        if(escape===true){
            escape=false
            if(char!=='\\'&&char!=="'"){
                array.push('\\')
            }
            array.push(char)
            continue
        }
        if(char==='\\'){
            escape=true
            continue
        }
        if(char==="'"){
            break
        }
        array.push(char)
    }
    return array.join('')
}
function parseToArrayValueWithIndex(string:string,index:number){
    return tempArrayToSTONArrayValueWithIndex(splitToArrayWithIndex(string,index))
}
function parseToArray(string:string){
    return tempArrayToSTONArray(splitToArray(string))
}
function parseToObjectValueWithIndex(string:string,index:number){
    return tempArrayToSTONObjectValueWithIndex(splitToArrayWithIndex(string,index,true))
}
function parseToObject(string:string){
    return tempArrayToSTONObject(splitToArray(string,true))
}
function parseToValueWithIndex(string:string,index:number):STONValueWithIndex|undefined{
    if(string===''){
        return undefined
    }
    const start=string[0]
    if(start==="'"){
        return parseToString(string.slice(1))
    }
    if(start==='['){
        return parseToArrayValueWithIndex(string.slice(1),index+1)
    }
    if(start==='{'){
        return parseToObjectValueWithIndex(string.slice(1),index+1)
    }
    string=string.trimEnd()
    if(string==='true'){
        return true
    }
    if(string==='false'){
        return false
    }
    if(/^(?:[+-]?Infinity|NaN|0x[\da-fA-F]+|0o[0-7]+|0b[01]+|[+-]?(?:\d*\.?\d+|\d+\.)(?:e[+-]?\d+)?)$/.test(string)){
        return Number(string)
    }
    if(/[',{}\[\]\n\r]/.test(string)){
        return undefined
    }
    return string
}
export function parseWithIndex(string:string,index=0):STONWithIndex|undefined{
    index+=string.length
    string=string.trimStart()
    index-=string.length
    const value=parseToValueWithIndex(string,index)
    if(value===undefined){
        return undefined
    }
    return {
        value:value,
        index
    }
}
export function parse(string:string):STON|undefined{
    string=string.trimStart()
    if(string===''){
        return undefined
    }
    const start=string[0]
    if(start==="'"){
        return parseToString(string.slice(1))
    }
    if(start==='['){
        return parseToArray(string.slice(1))
    }
    if(start==='{'){
        return parseToObject(string.slice(1))
    }
    string=string.trimEnd()
    if(string==='true'){
        return true
    }
    if(string==='false'){
        return false
    }
    if(/^(?:[+-]?Infinity|NaN|0x[\da-fA-F]+|0o[0-7]+|0b[01]+|[+-]?(?:\d*\.?\d+|\d+\.)(?:e[+-]?\d+)?)$/.test(string)){
        return Number(string)
    }
    if(/[',{}\[\]\n\r]/.test(string)){
        return undefined
    }
    return string
}
function stringifyString(string:string){
    return "'"+string.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/(^|[^\\])\\\\(?=[^\\"'])/g,'$1\\')+"'"
}
export interface BeautifyOptions{
    indentTarget?:'none'|'all'|'array'|'object'|'arrayInObject'|'arrayInObjectAndThis'
    indentLevel?:number
    addDecorativeComma?:'never'|'always'|'inObject'
}
function stringifyArray(array:STONArray,{indentTarget,indentLevel,addDecorativeComma}:BeautifyOptions){
    indentTarget=indentTarget??'none'
    indentLevel=indentLevel??1
    addDecorativeComma=addDecorativeComma??'never'
    const out:string[]=[]
    const expand=array.length>1&&(indentTarget==='all'||indentTarget==='array'||indentTarget==='arrayInObjectAndThis')
    if(indentTarget==='arrayInObjectAndThis'){
        indentTarget='arrayInObject'
    }
    for(let i=0;i<array.length;i++){
        const string=stringify(array[i],{indentTarget,indentLevel:indentLevel+(expand?1:0),addDecorativeComma})
        if(
            (string.endsWith("'")||string.endsWith('}')||string.endsWith(']'))&&addDecorativeComma!=='always'
            ||i===(array.length-1)||expand
        ){
            out.push(string)
        }else{
            out.push(string+',')
        }
    }
    let add=''
    for(let i=1;i<indentLevel;i++){
        add+='    '
    }
    if(expand){
        return '['+'\n    '+add+out.join('\n    '+add)+'\n'+add+']'
    }else{
        return '['+out.join('')+']'
    }
}
function stringifyObject(object:STONObject,{indentTarget,indentLevel,addDecorativeComma}:BeautifyOptions){
    indentTarget=indentTarget??'none'
    indentLevel=indentLevel??1
    addDecorativeComma=addDecorativeComma??'never'
    const out:string[]=[]
    const keys=Object.keys(object)
    const expand=keys.length>1&&(indentTarget==='all'||indentTarget==='object')
    if(indentTarget==='arrayInObject'){
        indentTarget='arrayInObjectAndThis'
    }
    for(let i=0;i<keys.length;i++){
        const key=keys[i]
        const result=key.match(/^[\w-]+$/)
        if(result===null){
            continue
        }
        const value=object[key]
        const string=stringify(value,{indentTarget,indentLevel:indentLevel+(expand?1:0),addDecorativeComma})
        if(string.startsWith("'")||string.startsWith('[')||string.startsWith('{')){
            if(addDecorativeComma!=='always'&&addDecorativeComma!=='inObject'||i===(keys.length-1)||expand){
                out.push((key==='__'?'':key)+string)
            }else{
                out.push((key==='__'?'':key)+string+',')
            }
        }else if(string==='true'){
            if(i===(keys.length-1)||expand){
                out.push(key)
            }else{
                out.push(key+',')
            }
        }else{
            if(i===(keys.length-1)||expand){
                out.push(key+' '+string)
            }else{
                out.push(key+' '+string+',')
            }
        }
    }
    let add=''
    for(let i=1;i<indentLevel;i++){
        add+='    '
    }
    if(expand){
        return '{'+'\n    '+add+out.join('\n    '+add)+'\n'+add+'}'
    }else{
        return '{'+out.join('')+'}'
    }
}
export function stringify(ston:STON|undefined,beautifyOptions:BeautifyOptions={}){
    if(ston===undefined){
        return ''
    }
    if(typeof ston==='number'){
        return ston.toString()
    }
    if(typeof ston==='string'){
        return stringifyString(ston)
    }
    if(ston===true){
        return 'true'
    }
    if(ston===false){
        return 'false'
    }
    if(Array.isArray(ston)){
        return stringifyArray(ston,beautifyOptions)
    }
    return stringifyObject(ston,beautifyOptions)
}