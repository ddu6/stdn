# STDN
```js
const stdn=require('stdn')
console.log(stdn.stringify(stdn.parse(`{'a_1=1'}
{display,'a_2=2'}
['Let '{'a_3=3'}.]
{id eq1,equation[{'a_4=4'}]}
{id eq2,mark{[[{ref-id eq1,class plain,ref[]}{'\\''}]]},equation[{'a_5=5'}]}
{class display,aligned[
    ['a_6&=6\\ \\text{see '{ref-id eq2,ref[]}'}\\\\\\\\']
    'a_{1000}&=1000'
]}
{id th1,mark A,desc DDU,theorem[STDN is easy to use.]}
{proof[We leave it to the reader.]}
{id co1,corollary[{id eq3,mark{'\\square'},class plain,equation[STDN is a good language.]}]}`)))

/* output
{'a_1=1'}
{display, 'a_2=2'}
['Let '{'a_3=3'}'.']
{id 'eq1', equation [{'a_4=4'}]}
{id 'eq2', mark {[[{ref-id 'eq1', class 'plain', ref []}{'\''}]]}, equation [{'a_5=5'}]}
{class 'display', aligned [
    ['a_6&=6\ \text{see '{ref-id 'eq2', ref []}'}\\\\']
    'a_{1000}&=1000'
]}
{id 'th1', mark 'A', desc 'DDU', theorem ['STDN is easy to use.']}
{proof ['We leave it to the reader.']}
{id 'co1', corollary [{id 'eq3', mark {'\square'}, class 'plain', equation ['STDN is a good language.']}]}
*/
```