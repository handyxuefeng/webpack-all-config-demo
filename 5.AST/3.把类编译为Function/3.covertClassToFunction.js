/**
 * 把类编译为Function
 * yarn add @babel-plugin-transform-es2015-classes -D
 */
let babel = require("@babel/core"); //把es6语法转换成AST语法
let t = require("babel-types"); //类型判断某个节点是否是某种类型，或者创建一个新的某种类型的节点

//官方插件
//let classComplierToFuncitonPlugin = require("@babel/plugin-transform-classes"); 

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

/**
 * babel 插件 #
- 访问者模式 Visitor 对于某个对象或者一组对象，不同的访问者，产生的结果不同，执行操作也不同
- @babel/core Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse
- babylon Babel 的解析器
- babel-types 用于 AST 节点的 Lodash 式工具库, 它包含了构造、验证以及变换 AST 节点的方法，对编写处理 AST 逻辑非常有用
- babel-traverse用于对 AST 的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点
- babel-types-api
- Babel 插件手册
- babeljs.io babel 可视化编译器
- babel/types 提供了t.functionDeclaration, t.memberExpression 提供的一些列方法用来把es6转换为es5
*/
let classComplierToFunction = {
  //visitor表示要访问ast语法树的那些节点
  visitor: {
    //这里定义ClassDeclaration方法，表示是从ast语法树的ClassDeclaration 节点开始遍历,参数path = ClassDeclaration
    ClassDeclaration(path) {
      let node = path.node; //类的节点
      let id = node.id; //类的名字 Person
      let methods = node.body.body; //获取类的方法[constructor,getName];
      let constructorFunction;
      let newNodes = [];
      methods.forEach((item) => {
        //  console.log('key = ',item.key);

        //如果是构造函数,开始拼装
        if (item.kind === "constructor") {
          constructorFunction = t.functionDeclaration(
            id,
            item.params,
            item.body,
            item.generator,
            item.async
          );
          newNodes.push(constructorFunction); //类中构造函数放入数组中
        } else {
          //非构造函数的方法的处理
          // t.memberExpression() 成员表达式方法
          let prototype = t.identifier("prototype"); //申明prototype标识符
          console.log("prototype= ", prototype);
          /**
                     * Person.prototype.getName = function () {
                        return this.name; 
                       };
                    */
          //开始拼装Person.prototype.getName
          let leftMemberExpression = t.memberExpression(
            t.memberExpression(id, prototype), //Person.prototype
            item.key // getName
          );

          console.log("leftMemberExpression=", leftMemberExpression);

          //2.开始拼装 = 右边的 function (){ return this.name }
          let rightFunctionExpression = t.functionExpression(
            item.key,
            item.params,
            item.body,
            item.generator,
            item.async
          );
          console.log("rightFunctionExpression=", rightFunctionExpression);

          //3.通过赋值语句表达式拼装左边和右边
          let assginExpression = t.assignmentExpression(
            "=",
            leftMemberExpression,
            rightFunctionExpression
          );
          newNodes.push(assginExpression);
        }
      });
      path.replaceWithMultiple(newNodes);
    },
  },
};
let convertResult = babel.transform(code, {
  plugins: [classComplierToFunction],
});

console.log("转换之后的代码为= ", convertResult.code);
