let sync = require("./sync"); //同步导入代码方式

import(/*webpackChunkName: "title"*/ "./title").then((result) => {
  console.log(result.default);
});

import(/*webpackChunkName: "sum"*/ "./sum").then((result) => {
  console.log(result.default);
});

console.log("sync = ", sync);
