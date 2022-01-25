import {parseWithIndex} from 'ston/dist/parse-with-index'
import {stringifyWithComment} from 'ston/dist/stringify-with-comment'
export function format(string: string) {
    const result = parseWithIndex(`[${string}]`)
    if (result === undefined || !Array.isArray(result.value)) {
        return string
    }
    if (result.value.length < 2) {
        return stringifyWithComment(result.value, {
            indentTarget: 'arrayInObjectAndThis',
            addDecorativeComma: 'inObject',
            addDecorativeSpace: 'always',
            useUnquotedString: true,
        }).slice(1, -1).trim()
    }
    return stringifyWithComment(result.value, {
        indentLevel: -1,
        indentTarget: 'arrayInObjectAndThis',
        addDecorativeComma: 'inObject',
        addDecorativeSpace: 'always',
        useUnquotedString: true,
    }).slice(1, -1).trim()
}