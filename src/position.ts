import type {STDN, STDNLine, STDNUnit, STDNUnitOption} from './parse'
export type STDNPosition = (number | string)[]
export function parsePositionStr(string: string) {
    return string.trim().split(/\s+/).map(value => {
        if (/^\d+$/.test(value)) {
            return Number(value)
        }
        if (value.startsWith('"')) {
            return value.slice(1, -1)
        }
        return value
    })
}
export function stringifyPosition(position: STDNPosition) {
    return position.map(value => {
        if (typeof value === 'number') {
            return value
        }
        if (/^\d+$/.test(value)) {
            return `'${value}'`
        }
        return value
    }).join(' ')
}
export function positionToUnitOrLines(position: STDNPosition, stdn: STDN, offset = 0) {
    const out: (STDNUnit | STDNLine)[] = []
    if (position.length === 0 || stdn.length === 0) {
        return out
    }
    const step = position[0]
    if (typeof step !== 'number') {
        return out
    }
    const line = stdn[Math.min(stdn.length - 1, step + offset)]
    if (line === undefined) {
        return out
    }
    out.push(line)
    let unitOrLine: STDNUnit | STDNLine = line
    for (let i = 1; i < position.length; i++) {
        const step = position[i]
        if (typeof step === 'number') {
            if (Array.isArray(unitOrLine)) {
                const unit: STDNUnit | string | undefined = unitOrLine[step]
                if (typeof unit !== 'object') {
                    break
                }
                out.push(unitOrLine = unit)
                continue
            }
            const line: STDNLine | undefined = unitOrLine.children[step]
            if (line === undefined) {
                break
            }
            out.push(unitOrLine = line)
            continue
        }
        if (Array.isArray(unitOrLine)) {
            break
        }
        const unit: STDNUnitOption | undefined = unitOrLine.options[step]
        if (typeof unit !== 'object') {
            break
        }
        out.push(unitOrLine = unit)
    }
    return out
}