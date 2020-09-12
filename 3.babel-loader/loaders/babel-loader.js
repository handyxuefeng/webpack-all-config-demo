

let babelCore = require('@babel/core');

function babel(source) {
 console.log(`===========================JS开始打包${Date.now().toLocaleString()}=============================`);
 let options = {
     presets:['@babel/preset-env'], //配置预设，把es6-10的高级语法转换为es5
     sourceMap:true, //生成sourceMap文件
     filename:this.resourcePath.split('/').pop() //方便在debug的时候展示具体的文件名
 };

 //转换后的es5代码，新的source-map文件 ast 抽象语法树
 let {code,sourceMap,ast} = babelCore.transform(source,options);
 /**
   如果babel转换后提供了ast抽象语法树, 那么webpack 会直接 使用这个loader 提供的语法树
   不需要自己把code再转换成ast
 */

 let complierAfterCode = this.callback(null, code, sourceMap, ast);  // 这里的this 是 loaderContext上下文，callback 就是这个上面的方法

 return complierAfterCode;

}


module.exports = babel;