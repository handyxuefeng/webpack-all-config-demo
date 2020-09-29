
/**
 * 在commonjs规范中
 * 1. 导出用module.exports = {} 或者 exports.obj = {}
 * 2. 导入用require的形式
 */

let obj1 = require('./exports');
let obj2 = require('./module.exports')

console.log('obj1=',obj1,'obj2=',obj2);


