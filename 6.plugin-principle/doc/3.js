let filepath = './title.js';

/**
 *  1. commonjs  是运行时加载，里面加载的模块可以是变量,  无法实现静态分析
 */
let content = require(filepath); 
console.log('content=',content);


