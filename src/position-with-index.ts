import type {STONWithIndex} from 'ston'
import type {STDNLineWithIndexValue, STDNUnitOptionWithIndexValue, STDNUnitWithIndexValue, STDNWithIndexValue} from './parse-with-index'
import type {STDNPosition} from './position'
export function posiitonToUnitOrLinesWithIndex(position: STDNPosition, stdn: STONWithIndex<STDNWithIndexValue>, offset = 0) {
    const out: STONWithIndex<STDNUnitWithIndexValue | STDNLineWithIndexValue>[] = []
    const {value} = stdn
    if (position.length === 0 || value.length === 0) {
        return out
    }
    const step = position[0]
    if (typeof step !== 'number') {
        return out
    }
    const line = value[Math.min(value.length - 1, step + offset)]
    if (line === undefined) {
        return out
    }
    out.push(line)
    let unitOrLine: STDNUnitWithIndexValue | STDNLineWithIndexValue = line.value
    for (let i = 1; i < position.length; i++) {
        const step = position[i]
        if (typeof step === 'number') {
            if (Array.isArray(unitOrLine)) {
                const unit: STONWithIndex<STDNUnitWithIndexValue | string> | undefined = unitOrLine[step]
                if (unit === undefined) {
                    break
                }
                const value: STDNUnitWithIndexValue | string = unit.value
                if (typeof value !== 'object') {
                    break
                }
                out.push({
                    value,
                    index: unit.index,
                    comment: unit.comment
                })
                unitOrLine = value
                continue
            }
            const line: STONWithIndex<STDNLineWithIndexValue> | undefined = unitOrLine.children.value[step]
            if (line === undefined) {
                break
            }
            out.push(line)
            unitOrLine = line.value
            continue
        }
        if (Array.isArray(unitOrLine)) {
            break
        }
        const unit: STONWithIndex<STDNUnitOptionWithIndexValue> | undefined = unitOrLine.options.value[step]
        if (unit === undefined) {
            break
        }
        const value: STDNUnitOptionWithIndexValue = unit.value
        if (typeof value !== 'object') {
            break
        }
        out.push({
            value,
            index: unit.index,
            comment: unit.comment
        })
        unitOrLine = value
    }
    return out
}