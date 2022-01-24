import * as ston from 'ston';
function objectToUnit(object) {
    let tag = 'div';
    let children = [];
    const options = {};
    for (const key of Object.keys(object)) {
        const value = object[key];
        if (value === undefined) {
            continue;
        }
        if (key === '__') {
            tag = 'katex';
            if (!Array.isArray(value)) {
                children = arrayToSTDN([value]);
                continue;
            }
            children = arrayToSTDN(value);
            continue;
        }
        if (Array.isArray(value)) {
            tag = key;
            children = arrayToSTDN(value);
            continue;
        }
        if (typeof value === 'object') {
            const { __ } = value;
            if (__ === undefined) {
                continue;
            }
            if (typeof __ === 'string') {
                options[key] = arrayToSTDN([{ __ }]);
                continue;
            }
            if (!Array.isArray(__)) {
                options[key] = arrayToSTDN([__]);
                continue;
            }
            options[key] = arrayToSTDN(__);
            continue;
        }
        options[key] = value;
    }
    return {
        tag,
        options,
        children
    };
}
function objectToUnitWithIndexValue(object, index) {
    let tag = 'div';
    const children = {
        value: [],
        index,
        comment: ''
    };
    const options = {
        value: {},
        index,
        comment: ''
    };
    for (const key of Object.keys(object)) {
        let valueWithIndex = object[key];
        if (valueWithIndex === undefined) {
            continue;
        }
        const { value, index, comment } = valueWithIndex;
        if (key === '__') {
            tag = 'katex';
            children.index = index;
            if (!Array.isArray(value)) {
                children.value = arrayToSTDNWithIndexValue([valueWithIndex], index);
                continue;
            }
            children.value = arrayToSTDNWithIndexValue(value, index);
            children.comment = comment;
            continue;
        }
        if (Array.isArray(value)) {
            tag = key;
            children.value = arrayToSTDNWithIndexValue(value, index);
            children.index = index;
            children.comment = comment;
            continue;
        }
        if (typeof value === 'object') {
            const { __ } = value;
            if (__ === undefined) {
                continue;
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
                };
                continue;
            }
            if (!Array.isArray(__.value)) {
                options.value[key] = {
                    value: arrayToSTDNWithIndexValue([__], index),
                    index,
                    comment
                };
                continue;
            }
            options.value[key] = {
                value: arrayToSTDNWithIndexValue(__.value, index),
                index,
                comment
            };
            continue;
        }
        options.value[key] = {
            value,
            index,
            comment
        };
    }
    return {
        tag: {
            value: tag,
            index,
            comment: ''
        },
        options,
        children
    };
}
function arrayToLine(array) {
    const out = [];
    for (const item of array) {
        if (typeof item === 'string') {
            for (const char of item) {
                if (char >= ' ') {
                    out.push(char);
                }
            }
            continue;
        }
        if (typeof item === 'object' && !Array.isArray(item)) {
            out.push(objectToUnit(item));
        }
    }
    return out;
}
function arrayToLineWithIndexValue(array) {
    const out = [];
    for (const { value, index, comment } of array) {
        if (typeof value === 'string') {
            for (const char of value) {
                if (char >= ' ') {
                    out.push({
                        value: char,
                        index,
                        comment: ''
                    });
                }
            }
            continue;
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
            out.push({
                value: objectToUnitWithIndexValue(value, index),
                index,
                comment
            });
        }
    }
    return out;
}
function arrayToSTDN(array) {
    const out = [];
    for (const item of array) {
        if (!Array.isArray(item)) {
            out.push(arrayToLine([item]));
            continue;
        }
        out.push(arrayToLine(item));
    }
    return out;
}
function arrayToSTDNWithIndexValue(array, index) {
    const out = [];
    for (const item of array) {
        if (!Array.isArray(item.value)) {
            out.push({
                value: arrayToLineWithIndexValue([item]),
                index,
                comment: ''
            });
            continue;
        }
        out.push({
            value: arrayToLineWithIndexValue(item.value),
            index: item.index,
            comment: item.comment
        });
    }
    return out;
}
export function parse(string) {
    const array = ston.parse(`[${string}]`);
    if (!Array.isArray(array)) {
        return undefined;
    }
    return arrayToSTDN(array);
}
export function parseWithIndex(string) {
    const result = ston.parseWithIndex(`[${string}]`);
    if (result === undefined || !Array.isArray(result.value)) {
        return undefined;
    }
    return {
        value: arrayToSTDNWithIndexValue(result.value, result.index),
        index: result.index,
        comment: result.comment
    };
}
function unitToObject(unit) {
    const out = {};
    const { tag, children, options } = unit;
    for (const key of Object.keys(options)) {
        let value = options[key];
        if (typeof value !== 'object') {
            out[key] = value;
            continue;
        }
        out[key] = { __: stdnToArrayOrKString(value) };
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
function stdnToArrayOrKString(stdn) {
    const array = stdnToArray(stdn);
    if (array.length === 1) {
        const item = array[0];
        if (typeof item === 'object' && !Array.isArray(item)) {
            const keys = Object.keys(item);
            if (keys.length === 1 && keys[0] === '__') {
                const { __ } = item;
                if (typeof __ === 'string') {
                    return __;
                }
            }
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
            indentTarget: 'arrayInObjectAndThis',
            addDecorativeComma: 'inObject',
            addDecorativeSpace: 'always',
            useUnquotedString: true,
        }).slice(1, -1).trim();
    }
    return ston.stringify(stdnToArray(stdn), {
        indentLevel: -1,
        indentTarget: 'arrayInObjectAndThis',
        addDecorativeComma: 'inObject',
        addDecorativeSpace: 'always',
        useUnquotedString: true,
    }).slice(1, -1).trim();
}
export function format(string) {
    const result = ston.parseWithIndex(`[${string}]`);
    if (result === undefined || !Array.isArray(result.value)) {
        return string;
    }
    if (result.value.length < 2) {
        return ston.stringifyWithComment(result.value, {
            indentTarget: 'arrayInObjectAndThis',
            addDecorativeComma: 'inObject',
            addDecorativeSpace: 'always',
            useUnquotedString: true,
        }).slice(1, -1).trim();
    }
    return ston.stringifyWithComment(result.value, {
        indentLevel: -1,
        indentTarget: 'arrayInObjectAndThis',
        addDecorativeComma: 'inObject',
        addDecorativeSpace: 'always',
        useUnquotedString: true,
    }).slice(1, -1).trim();
}
