import * as ston from 'ston/dist/parse';
function objectToUnit(object) {
    let tag = 'div';
    let children = [];
    const options = {};
    for (const key in object) {
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
export function parse(string) {
    const array = ston.parse(`[${string}]`);
    if (!Array.isArray(array)) {
        return undefined;
    }
    return arrayToSTDN(array);
}
