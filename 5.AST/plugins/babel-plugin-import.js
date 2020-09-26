let babel = require("@babel/core"); //把es6语法转换成AST语法
let t = require("babel-types"); //类型判断某个节点是否是某种类型，或者创建一个新的某种类型的节点

//babel-types文档api：https://babeljs.io/docs/en/next/babel-types.html

let treeShakingPlugin = {
  visitor: {
    ImportDeclaration(path, states = { opts }) {
      let node = path.node;
      let specifiers = node.specifiers; //["flatten", "concat"];
      let source = node.source;
      //console.log(specifiers,'==',states.opts);
      /**
       * webpack.config.js配置的规则[path.resolve(__dirname,"plugins/babel-plugin-import.js"), {libraries:['lodash']}],
       * 根据webpack.config.js中 配置的 规则，查看自定义的属性{libraries:['lodash']},看是对那些库最tree-shaking
       */
      if(states.opts.libraries.includes(source.value)) {

        console.log("开始把ast语法树转换=", source.value);

        let newSpecifiers = specifiers.map((specifier) => {
          //t.importDeclaration(specifiers, source)
          //t.stringLiteral(value)
          return t.importDeclaration(
            [t.importDefaultSpecifier(specifier.local)],
            t.stringLiteral(`${source.value}/${specifier.imported.name}`) // 得到 loash/flatten
          );
        });
        path.replaceWithMultiple(newSpecifiers);
      }
      
    },
  },
};

//插件导出的是一个函数，函数里面返回的是一个对象
module.exports = function () {
  return treeShakingPlugin;
};
