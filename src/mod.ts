import type {STONArray, STONArrayWithIndexValue, STONObject, STONObjectWithIndexValue, STONWithIndex} from 'ston'
import * as ston from 'ston'
export type STDNUnitOption = STDN | string | number | boolean
export type STDNUnitOptionWithIndexValue = STDNWithIndexValue | string | number | boolean
export interface STDNUnitOptions {
    [key: string]: STDNUnitOption | undefined
}
export interface STDNUnitOptionsWithIndexValue extends STONObjectWithIndexValue {
    [key: string]: STONWithIndex<STDNUnitOptionWithIndexValue> | undefined
}
export interface STDNUnit {
    tag: string
    options: STDNUnitOptions
    children: STDN
}
export interface STDNUnitWithIndexValue extends STONObjectWithIndexValue {
    tag: STONWithIndex<string>
    options: STONWithIndex<STDNUnitOptionsWithIndexValue>
    children: STONWithIndex<STDNWithIndexValue>
}
export type STDNLine = (STDNUnit | string)[]
export type STDNLineWithIndexValue = STONWithIndex<STDNUnitWithIndexValue | string>[]
export type STDN = STDNLine[]
export type STDNWithIndexValue = STONWithIndex<STDNLineWithIndexValue>[]
export type STDNUnitObject = {
    [key: string]: STDNArray | {__: STDNArray | string} | string | number | boolean | undefined
}
export type STDNInlineSTON = STDNUnitObject | string
export type STDNLineSTON = STDNInlineSTON[] | STDNInlineSTON
export type STDNArray = STDNLineSTON[]
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
            const {__} = value
            if (__ === undefined) {
                continue
            }
            if (typeof __ === 'string') {
                options[key] = arrayToSTDN([{__}])
                continue
            }
            if (!Array.isArray(__)) {
                options[key] = arrayToSTDN([__])
                continue
            }
            options[key] = arrayToSTDN(__)
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
function objectToUnitWithIndexValue(object: STONObjectWithIndexValue, index: number): STDNUnitWithIndexValue {
    let tag = 'div'
    const children: STONWithIndex<STDNWithIndexValue> = {
        value: [],
        index,
        comment: ''
    }
    const options: STONWithIndex<STDNUnitOptionsWithIndexValue> = {
        value: {},
        index,
        comment: ''
    }
    for (const key in object) {
        let valueWithIndex = object[key]
        if (valueWithIndex === undefined) {
            continue
        }
        const {value, index, comment} = valueWithIndex
        if (key === '__') {
            tag = 'katex'
            children.index = index
            if (!Array.isArray(value)) {
                children.value = arrayToSTDNWithIndexValue([valueWithIndex], index)
                continue
            }
            children.value = arrayToSTDNWithIndexValue(value, index)
            children.comment = comment
            continue
        }
        if (Array.isArray(value)) {
            tag = key
            children.value = arrayToSTDNWithIndexValue(value, index)
            children.index = index
            children.comment = comment
            continue
        }
        if (typeof value === 'object') {
            const {__} = value
            if (__ === undefined) {
                continue
            }
            if (typeof __.value === 'string') {
                options.value[key] = {
                    value: arrayToSTDNWithIndexValue([{
                        value: {
                            __
                        },
                        index,
                        comment: ''
                    }], index),
                    index,
                    comment
                }
                continue
            }
            if (!Array.isArray(__.value)) {
                options.value[key] = {
                    value: arrayToSTDNWithIndexValue([__], index),
                    index,
                    comment
                }
                continue
            }
            options.value[key] = {
                value: arrayToSTDNWithIndexValue(__.value, index),
                index,
                comment
            }
            continue
        }
        options.value[key] = {
            value,
            index,
            comment
        }
    }
    return {
        tag: {
            value: tag,
            index,
            comment: ''
        },
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
function arrayToLineWithIndexValue(array: STONArrayWithIndexValue) {
    const out: STDNLineWithIndexValue = []
    for (const {value, index, comment} of array) {
        if (typeof value === 'string') {
            for (const char of value) {
                if (char >= ' ') {
                    out.push({
                        value: char,
                        index,
                        comment: ''
                    })
                }
            }
            continue
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
            out.push({
                value: objectToUnitWithIndexValue(value, index),
                index,
                comment
            })
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
function arrayToSTDNWithIndexValue(array: STONArrayWithIndexValue, index: number): STDNWithIndexValue {
    const out: STDNWithIndexValue = []
    for (const item of array) {
        if (!Array.isArray(item.value)) {
            out.push({
                value: arrayToLineWithIndexValue([item]),
                index,
                comment: ''
            })
            continue
        }
        out.push({
            value: arrayToLineWithIndexValue(item.value),
            index: item.index,
            comment: item.comment
        })
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
export function parseWithIndex(string: string): STONWithIndex<STDNWithIndexValue> | undefined {
    const result = ston.parseWithIndex(`[${string}]`)
    if (result === undefined || !Array.isArray(result.value)) {
        return undefined
    }
    return {
        value: arrayToSTDNWithIndexValue(result.value, result.index),
        index: result.index,
        comment: result.comment
    }
}
function unitToObject(unit: STDNUnit) {
    const out: STDNUnitObject = {}
    const {tag, children, options} = unit
    for (const key in options) {
        let value = options[key]
        if (typeof value !== 'object') {
            out[key] = value
            continue
        }
        out[key] = {__: stdnToArrayOrKString(value)}
    }
    if (tag === 'katex') {
        out.__ = stdnToArrayOrString(children)
    } else if (tag !== 'div' || children.length > 0) {
        out[tag] = stdnToArray(children)
    }
    return out
}
function lineToSTON(line: STDNLine) {
    const out: STDNInlineSTON[] = []
    let string = ''
    for (const inline of line) {
        if (typeof inline === 'object') {
            if (string.length > 0) {
                out.push(string)
                string = ''
            }
            out.push(unitToObject(inline))
            continue
        }
        string += inline
    }
    if (string.length > 0) {
        out.push(string)
    }
    if (out.length === 1) {
        return out[0]
    }
    return out
}
function stdnToArray(stdn: STDN) {
    const out: STDNArray = []
    for (const line of stdn) {
        out.push(lineToSTON(line))
    }
    return out
}
function stdnToArrayOrString(stdn: STDN) {
    const array = stdnToArray(stdn)
    if (array.length === 1) {
        const item = array[0]
        if (typeof item === 'string') {
            return item
        }
    }
    return array
}
function stdnToArrayOrKString(stdn: STDN) {
    const array = stdnToArray(stdn)
    if (array.length === 1) {
        const item = array[0]
        if (typeof item === 'object' && !Array.isArray(item)) {
            const keys = Object.keys(item)
            if (keys.length === 1 && keys[0] === '__') {
                const {__} = item
                if (typeof __ === 'string') {
                    return __
                }
            }
        }
    }
    return array
}
export function stringify(stdn: STDN | undefined) {
    if (stdn === undefined) {
        return ''
    }
    if (stdn.length < 2) {
        return ston.stringify(stdnToArray(stdn), {
            indentTarget: 'arrayInObjectAndThis',
            addDecorativeComma: 'inObject',
            addDecorativeSpace: 'always',
            useUnquotedString: true,
        }).slice(1, -1).trim()
    }
    return ston.stringify(stdnToArray(stdn), {
        indentLevel: -1,
        indentTarget: 'arrayInObjectAndThis',
        addDecorativeComma: 'inObject',
        addDecorativeSpace: 'always',
        useUnquotedString: true,
    }).slice(1, -1).trim()
}
export function format(string: string) {
    const result = ston.parseWithIndex(`[${string}]`)
    if (result === undefined || !Array.isArray(result.value)) {
        return string
    }
    if (result.value.length < 2) {
        return ston.stringifyWithComment(result.value, {
            indentTarget: 'arrayInObjectAndThis',
            addDecorativeComma: 'inObject',
            addDecorativeSpace: 'always',
            useUnquotedString: true,
        }).slice(1, -1).trim()
    }
    return ston.stringifyWithComment(result.value, {
        indentLevel: -1,
        indentTarget: 'arrayInObjectAndThis',
        addDecorativeComma: 'inObject',
        addDecorativeSpace: 'always',
        useUnquotedString: true,
    }).slice(1, -1).trim()
}