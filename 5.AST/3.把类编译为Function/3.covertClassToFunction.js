/**
 * 把类编译为Function
 * yarn add @babel-plugin-transform-es2015-classes -D
 */
let babel = require('@babel/core');//把es6语法转换成AST语法
let t = require('babel-types'); //类型判断某个节点是否是某种类型，或者创建一个新的某种类型的节点
let classComplierToFuncitonPlugin= require('babel-plugin-transform-es2015-classes');

let code = `
    class Person {
        constructor(name){
            this.name = name;
        }
        getName(){
            return this.name
        }
    }
`;
/**
上面代码要转换成的目标代码，转换的过程要把下面的代码放在astExplorer.net 查看其ast语法树
function Person(name) {
  this.name = name;
}
Person.prototype.getName = function () {
  return this.name; 
};
*/

let classComplierToFunction = {
    //visitor表示要访问ast语法树的那些节点
    visitor:{
        ClassDeclaration(path){
            let node= path.node; //类的节点
            let id = node.id;//类的名字 Person
            let methods = node.body.body; //获取类的方法[constructor,getName];
            let constructorFunciton;
            methods.forEach(item => {
                //如果是构造函数
                if(item.kind==='constructor') {

                    
                }
            });

        }
    }
};
let convertResult = babel.transform(code,{
    plugins:[classComplierToFuncitonPlugin]
});

console.log('转换之后的代码为= ',convertResult.code);
