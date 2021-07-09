const ston=require('../dist/mod')
console.log(ston.stringify(ston.parse(`{
    standalone-key
    // default val is true
    'default key' // is __
    /*
    - key must match [a-zA-Z_-]+ and should not be quoted
    - str val can not be quoted with double quotes
    */
    unquoted-str is supported
    number[
        .5
        +2e-3
        [-Infinity,NaN]
        [0xFF,0b11,0o66]
    ]
}`),{indentTarget:'object'}))
console.log(ston.stringify(ston.parseWithIndex(`{
    standalone-key
    // default val is true
    'default key' // is __
    /*
    - key must match [a-zA-Z_-]+ and should not be quoted
    - str val can not be quoted with double quotes
    */
    unquoted-str is supported
    number[
        .5
        +2e-3
        [-Infinity,NaN]
        [0xFF,0b11,0o66]
    ]
}`),{indentTarget:'object'}))