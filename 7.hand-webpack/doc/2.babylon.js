const babylon = require("babylon"); //babylon 类似 @babel/parser 可以把代码转换成ast语法树
const { Tapable } = require("tapable");
class Parser extends Tapable {
  constructor() {
    super();
  }
  parser(code) {
    let ast = babylon.parse(code, {
      sourceType: "module", //源代码是一个模块
      plugins: ["dynamicImport"], //额外一个插件，支持import('./title.js')
    });
    console.log("ast = ", ast);
    return ast;
  }
}

let code = `
  const sum = (a,b)=>a+b;
`;

let parserObj = new Parser();

let ast = parserObj.parser(code);
console.log("ast=", ast);




exports = module.exports = Parser;
