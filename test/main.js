const stdn = require('../mod.c')
let example = `{id flt, mark FLT, desc Fermat, theorem [
    ['Let '{'n'}' be an integer greater than '{'2,'}' then there are no positive integers '{'a,b,c'}' satisfying']
    {display, 'a^n+b^n=c^n.'}
]}
['The first successful proof of '{ref-id flt, ref []}' was released in 1994 by Andrew Wiles.']`
console.log(stdn.parseWithIndex(example))
console.log(stdn.format(example) === example)
example = `{id tlt, mark FLT, desc Fermat, theorem [
    ['Let '{'n'}' be an integer greater than '{'2,'}' then there are no positive integers '{'a,b,c'}' satisfying']
    {display, 'a^n+b^n=c^n.'}
]}`
console.log(stdn.format(example) === example)
example = ``
console.log(stdn.format(example) === example)