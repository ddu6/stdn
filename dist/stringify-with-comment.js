import * as ston from 'ston/dist/stringify-with-comment';
function unitToObject(unit) {
    const out = {};
    const { tag: { value: tag }, children, options: { value: options } } = unit;
    for (const key in options) {
        const valueWithIndex = options[key];
        if (valueWithIndex === undefined) {
            continue;
        }
        const { value, index, comment } = valueWithIndex;
        if (typeof value !== 'object') {
            out[key] = {
                value,
                index,
                comment
            };
            continue;
        }
        out[key] = {
            value: unitToObject(value),
            index,
            comment
        };
    }
    if (tag === 'katex') {
        out.__ = {
            value: stdnToArrayOrString(children.value),
            index: children.index,
            comment: children.comment
        };
    }
    else if (tag !== 'div' || children.value.length > 0) {
        out[tag] = {
            value: stdnToArray(children.value),
            index: children.index,
            comment: children.comment
        };
    }
    return out;
}
function lineToSTON(line) {
    const out = [];
    let string = '';
    let stringIndex = 0;
    let stringComment = '';
    for (const { value, index, comment } of line) {
        if (typeof value === 'object') {
            if (string.length > 0) {
                out.push({
                    value: string,
                    index: stringIndex,
                    comment: stringComment
                });
                string = '';
            }
            out.push({
                value: unitToObject(value),
                index,
                comment
            });
            continue;
        }
        if (string.length === 0) {
            stringIndex = index;
            stringComment = comment;
        }
        string += value;
    }
    if (string.length > 0) {
        out.push({
            value: string,
            index: stringIndex,
            comment: stringComment
        });
    }
    if (out.length === 1) {
        return out[0].value;
    }
    return out;
}
function stdnToArray(stdn) {
    const out = [];
    for (const { value, index, comment } of stdn) {
        out.push({
            value: lineToSTON(value),
            index,
            comment
        });
    }
    return out;
}
function stdnToArrayOrString(stdn) {
    const array = stdnToArray(stdn);
    if (array.length === 1) {
        const { value } = array[0];
        if (typeof value === 'string') {
            return value;
        }
    }
    return array;
}
export function stringifyWithComment(stdn) {
    if (stdn === undefined) {
        return '';
    }
    const { value, index, comment } = stdn;
    if (value.length < 2) {
        return ston.stringifyWithComment({
            value: stdnToArray(value),
            index,
            comment
        }, {
            addDecorativeComma: 'inObject',
            addDecorativeSpace: 'always',
            indentTarget: 'arrayInObjectAndThis',
            useUnquotedString: true
        }).slice(1, -1).trim();
    }
    return ston.stringifyWithComment({
        value: stdnToArray(value),
        index,
        comment
    }, {
        addDecorativeComma: 'inObject',
        addDecorativeSpace: 'always',
        indentLevel: -1,
        indentTarget: 'arrayInObjectAndThis',
        useUnquotedString: true
    }).slice(1, -1).trim();
}
