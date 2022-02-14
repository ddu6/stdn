import {parseWithIndex} from './parse-with-index'
import {stringifyWithComment} from './stringify-with-comment'
export function format(string: string) {
    return stringifyWithComment(parseWithIndex(string))
}