import type {STONArray, STONObject} from 'ston'
import * as ston from 'ston/dist/parse'
export type STDNUnitOption = STDNUnit | string | number | boolean
export interface STDNUnitOptions {
    [key: string]: STDNUnitOption | undefined
}
export interface STDNUnit extends STONObject {
    tag: string
    options: STDNUnitOptions
    children: STDN
}
export type STDNLine = (STDNUnit | string)[]
export type STDN = STDNLine[]
function objectToUnit(object: STONObject) {
    let tag = 'div'
    let children: STDN = []
    const options: STDNUnitOptions = {}
    for (const key in object) {
        const value = object[key]
        if (value === undefined) {
            continue
        }
        if (key === '__') {
            tag = 'katex'
            if (!Array.isArray(value)) {
                children = arrayToSTDN([value])
                continue
            }
            children = arrayToSTDN(value)
            continue
        }
        if (Array.isArray(value)) {
            tag = key
            children = arrayToSTDN(value)
            continue
        }
        if (typeof value === 'object') {
            options[key] = objectToUnit(value)
            continue
        }
        options[key] = value
    }
    return {
        tag,
        options,
        children
    }
}
function arrayToLine(array: STONArray) {
    const out: STDNLine = []
    for (const item of array) {
        if (typeof item === 'string') {
            for (const char of item) {
                if (char >= ' ') {
                    out.push(char)
                }
            }
            continue
        }
        if (typeof item === 'object' && !Array.isArray(item)) {
            out.push(objectToUnit(item))
        }
    }
    return out
}
function arrayToSTDN(array: STONArray) {
    const out: STDN = []
    for (const item of array) {
        if (!Array.isArray(item)) {
            out.push(arrayToLine([item]))
            continue
        }
        out.push(arrayToLine(item))
    }
    return out
}
export function parse(string: string) {
    const array = ston.parse(`[${string}]`)
    if (!Array.isArray(array)) {
        return undefined
    }
    return arrayToSTDN(array)
}