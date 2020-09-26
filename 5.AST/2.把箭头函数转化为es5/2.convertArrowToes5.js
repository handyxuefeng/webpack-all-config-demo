/**
 * 通过@babel/parse 
 * 1.安装 yarn add @babel/core babel-types @babel/plugin-transform-arrow-functions -D
 把下面es6的代码

 const sum = (a,b)=> a+b;

 转换结果为:

 const sum = function sum(a, b) {
  return a + b;
};

*/
let babel = require('@babel/core');//把es6语法转换成AST语法
let t = require('babel-types'); //类型判断某个节点是否是某种类型，或者创建一个新的某种类型的节点
let code = `const sum = (a,b)=> a+b;`;
let arrowFunctionPlugin = require('@babel/plugin-transform-arrow-functions');
const { generate } = require('escodegen');

//官方的转换写法
/*
let converResult = babel.transform(code, {
    plugins: [arrowFunctionPlugin]
});
*/



// 手写es6转换es5的插件
let arrowFuntionToEs5Plugin =  {
    visitor:{
        ArrowFunctionExpression(path){
           // console.log('path = ',path);
            let node = path.node;  //当前路径上的节点
            let id = path.parent.id;  //父路径上的ID identifer sum
            let params = node.params;  //函数的参数
           
           //console.log('id = ',id,'params = ',params);
            /**
             * 通过babel/types 提供的方法，构建对应的对象
             * babel/types类库提供了如下方法
             * t.FunctionExpression, 
             * t.BlockStatement
             * t.ReturnStatement
            */
            let returnStatement = t.returnStatement(node.body);  //函数的返回语句
            let body = t.blockStatement([returnStatement]);
            let functionExpression =  t.functionExpression(id, params,body,node.generate,node.async);
           // console.log('functionExpression=',functionExpression);
            path.replaceWith(functionExpression);
        }
    }
}

let converResult = babel.transform(code, {
    plugins: [arrowFuntionToEs5Plugin]
});


console.log(converResult.code);

