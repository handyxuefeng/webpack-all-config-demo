import isArray from "isarray";

let title = require("./title");
let sync0 = require("./sync-0");
let sync1 = require("./sync-1");
let sync2 = require("./sync-2");

console.log("sync0 = ", sync0, "sync1 = ", sync1, "sync2 = ", sync2);

/**
 * 异步导入导入代码
 */
import(/*webpackChunkName: "async-0"*/ "./async-0").then((result) => {
   console.log("在pages222222中异步导入代码 = ", result.default);
});
import(/*webpackChunkName: "async-1"*/ "./async-1").then((result) => {
  console.log("在pages222222中异步导入代码 = ", result.default);
});

import(/*webpackChunkName: "async-2"*/ "./async-2").then((result) => {
  console.log("在pages222222中异步导入代码 = ", result.default);
});

import(/*webpackChunkName: "async-3"*/ "./async-3").then((result) => {
  console.log("在pages222222中异步导入代码 = ", result.default);
});





console.log(`page222222___${title}____${Date.now() * 1}`);
console.log("[4,5, 1, 2] , isArray = ", isArray([4, 5, 1, 2]));
