let parser = require('./parse'); //引入自定义的把源码转ast语法树的方法
let sourceCode = `2+3*4`;
let ast = parser(sourceCode);

console.log(ast,null,2);