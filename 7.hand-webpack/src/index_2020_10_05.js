let sync = require("./sync"); //同步导入代码方式  require("./sync") 替换为 __webpack_require__("./src/sync.js")
let test = require("./test"); //同步导入代码方式

/**
import(/!*webpackChunkName: "title"*!/ "./title").then((result) => {
  console.log(result.default);
})
替换为下面的
__webpack_require__.e("title").then(__webpack_require__.t.bind(null, "./src/title.js", 7))
 .then(result => {
  console.log(result.default);
});
*/
import(/*webpackChunkName: "title"*/ "./title").then((result) => {
  console.log(result.default);
});

import(/*webpackChunkName: "sum"*/ "./sum").then((result) => {
  console.log(result.default);
});

import(/*webpackChunkName: "operate"*/ "./operate").then((result) => {
  console.log(result.default);
});

console.log("sync = ", sync, "test=", test);


/**
 * 在normalModule编写支持从node_modules加载第三方模块
*/

let isArray = require('isarray');
console.log('isArray =',isArray([1,2,3,5,6]));


