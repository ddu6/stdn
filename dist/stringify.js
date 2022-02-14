import * as ston from 'ston/dist/stringify';
function unitToObject(unit) {
    const out = {};
    const { tag, children, options } = unit;
    for (const key in options) {
        const value = options[key];
        if (typeof value !== 'object') {
            out[key] = value;
            continue;
        }
        out[key] = unitToObject(value);
    }
    if (tag === 'katex') {
        out.__ = stdnToArrayOrString(children);
    }
    else if (tag !== 'div' || children.length > 0) {
        out[tag] = stdnToArray(children);
    }
    return out;
}
function lineToSTON(line) {
    const out = [];
    let string = '';
    for (const inline of line) {
        if (typeof inline === 'object') {
            if (string.length > 0) {
                out.push(string);
                string = '';
            }
            out.push(unitToObject(inline));
            continue;
        }
        string += inline;
    }
    if (string.length > 0) {
        out.push(string);
    }
    if (out.length === 1) {
        return out[0];
    }
    return out;
}
function stdnToArray(stdn) {
    const out = [];
    for (const line of stdn) {
        out.push(lineToSTON(line));
    }
    return out;
}
function stdnToArrayOrString(stdn) {
    const array = stdnToArray(stdn);
    if (array.length === 1) {
        const item = array[0];
        if (typeof item === 'string') {
            return item;
        }
    }
    return array;
}
export function stringify(stdn) {
    if (stdn === undefined) {
        return '';
    }
    if (stdn.length < 2) {
        return ston.stringify(stdnToArray(stdn), {
            addDecorativeComma: 'inObject',
            addDecorativeSpace: 'always',
            indentTarget: 'arrayInObjectAndThis',
            useUnquotedString: true
        }).slice(1, -1).trim();
    }
    return ston.stringify(stdnToArray(stdn), {
        addDecorativeComma: 'inObject',
        addDecorativeSpace: 'always',
        indentLevel: -1,
        indentTarget: 'arrayInObjectAndThis',
        useUnquotedString: true
    }).slice(1, -1).trim();
}
