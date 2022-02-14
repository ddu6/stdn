import * as ston from 'ston/dist/stringify'
import type {STDN, STDNLine, STDNUnit} from './parse'
export type STDNUnitObject = {
    [key: string]: STDNArray | STDNUnitObject | string | number | boolean | undefined
}
export type STDNInlineSTON = STDNUnitObject | string
export type STDNLineSTON = STDNInlineSTON[] | STDNInlineSTON
export type STDNArray = STDNLineSTON[]
function unitToObject(unit: STDNUnit) {
    const out: STDNUnitObject = {}
    const {tag, children, options} = unit
    for (const key in options) {
        let value = options[key]
        if (typeof value !== 'object') {
            out[key] = value
            continue
        }
        out[key] = unitToObject(value)
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