const path = require("path");
const t = require("babel-types"); //babel-types-api 用于 AST 节点的 Lodash 式工具库, 它包含了构造、验证以及变换 AST 节点的方法，对编写处理 AST 逻辑非常有用，https://babeljs.io/docs/en/next/babel-types.html
const generate = require("babel-generator").default; // 把ast重新生成js代码
const traverse = require("babel-traverse").default; //  用于对 AST 的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点
const neoAsync = require("neo-async"); //类似promise-all
class NormalModule {
  /**
   * name = 'main'
   * entry  = './src/index.js'
   * context, = /Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack
   * resource = /Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack/src/index.js
   * parser = @babel/parser ,用来生成抽象语法树
   * @param {*} param0
   */
  constructor({
    name,
    entry,
    context,
    resource,
    parser,
    moduleId,
    async,
  }) {
    this.name = name;
    this.entry = entry;
    this.context = context;
    this.resource = resource; // /Users/hanxf.han/study/webpack-serial/webpack-all-config-demo/7.hand-webpack/src/index.js

    this.moduleId = moduleId || "./" + path.posix.relative(context, resource);

    //把模块内容转换为ast语法树的 解析器，parser 解析器有很多，指定一个就可以
    this.parser = parser;

    //此模块的代码内容
    this._source;

    //此模块对应的AST抽象语法树
    this._ast;

    //收集模块的依赖
    this.dependencies = [];

    //收集当前模块依赖哪些异步模块 import(哪些模块)
    this.blocks = []; //

    //表示当前的模块是一个异步代码块，还是一个同步代码块
    this.async = async;
  }
  /**
   * 模块的编译方法
   * @param {*} compilation
   * @param {*} callback
   */
  build(compilation, callback) {
    console.log(",this.resource=", this.resource);
    this.doBuild(compilation, (err) => {
      //1.通过babylon类库，得到源代码的ast语法树
      this._ast = this.parser.parserCode(this._source); //回调到这一步之后，开始把代码变成ast语法树

      /**
       * 2.遍历ast语法树，分析打包模块的存在的import，require依赖，并收集依赖
       * - 收集 require 依赖
       * - 收集 import 依赖
       */
      traverse(this._ast, {
        CallExpression: (pathNode) => {
          let node = pathNode.node;
          if (node.callee.name == "require") {
            //首先要把require 变成webpack中的__webpack_require__
            node.callee.name = "__webpack_require__";

            //如果方法名是require的话
            let requireScriptName = node.arguments[0].value; // 获取依赖的脚本的名称 requireScriptName = "./title.js"
            console.log("遍历AST语法时，遍历到了有require的文件名为=", requireScriptName);

            //判断是否添加了扩展名
            let extensionName =
              requireScriptName.split(path.posix.sep).pop().indexOf(".") == -1
                ? ".js"
                : "";

            /**
             *  1. 得到index.js文件所在的目录 = /Users/hanxf.han/study/webpack-serial/webpack-all-config-demo/7.hand-webpack/src
             *  path.posix.dirname('/Users/hanxf.han/study/webpack-serial/webpack-all-config-demo/7.hand-webpack/src/index.js') = /Users/hanxf.han/study/webpack-serial/webpack-all-config-demo/7.hand-webpack/src
             *  2. 连接依赖模块的路径：requireScriptName + extensionName = 'title.js';
             *
             *  3.拼装路径
             *   absolutePathOfRequireSource = path.posix.join('/Users/hanxf.han/study/webpack-serial/webpack-all-config-demo/7.hand-webpack/src','title.js')
             *
             */
            //获取依赖模块的绝对路径 = /Users/hanxf.han/study/webpack-serial/webpack-all-config-demo/7.hand-webpack/src/title.js
            let absolutePathOfRequireSource = path.posix.join(
              path.posix.dirname(this.resource), //this.resource = /Users/hanxf.han/study/webpack-serial/webpack-all-config-demo/7.hand-webpack/src/index.js
              requireScriptName + extensionName //
            );
            console.log("得到依赖文件的绝对路径=", absolutePathOfRequireSource);

            /**
             * 得到index.js  依赖的title.js 的模块Id, 也即是
             * depModuleId = './src/title.js'
             */
            let depModuleId =
              "./" +
              path.posix.relative(this.context, absolutePathOfRequireSource);
            console.log(
              `得到依赖模块${absolutePathOfRequireSource}相对根目录${this.context}的相对路径，也即是依赖模块${requireScriptName}的moduleId`,
              depModuleId
            );

            /**
             把ast语法树中的arguments修改成
             let title = __webpack_require__(/"./src/title.js");
             */
            let argumentsNode = [t.stringLiteral(depModuleId)];
            node.arguments = argumentsNode;

            //把依赖收集起来
            this.dependencies.push({
              name: this.name, // name=  filename:"bundle.js",
              context: this.context, //根目录
              rawRequest: requireScriptName, //依赖模块的名称title.js
              moduleId: depModuleId, // depModuleId = './src/title.js
              dependModuleAbsolutePath: absolutePathOfRequireSource, //依赖模块title.js的绝对路径
              resource: absolutePathOfRequireSource,
            });
          }

          if (node.callee.type == "Import") {
            console.log("这里是处理代码动态导入的流程");
            let moduleName = node.arguments[0].value; //得到 './title.js'
            //2.判断是否添加了扩展名
            let extensionName =
              moduleName.split(path.posix.sep).pop().indexOf(".") == -1
                ? ".js"
                : "";
            //3.获取依赖模块的绝对路径 = /Users/hanxf.han/study/webpack-serial/webpack-all-config-demo/7.hand-webpack/src/title.js
            let absolutePathOfRequireSource = path.posix.join(
              path.posix.dirname(this.resource),
              moduleName + extensionName
            );

            //4.得到模块ID
            let depModuleId ="./" + path.posix.relative(this.context, absolutePathOfRequireSource);

            /**
             * 5. 得到 /!*webpackChunkName: "title"*!/ 注释中 title
             */
            let chunkName = "0";
            if (
              Array.isArray(node.arguments[0].leadingComments) &&
              node.arguments[0].leadingComments.length > 0
            ) {
              let leadingComments = node.arguments[0].leadingComments[0].value;
              let regexp = /webpackChunkName:\s*['"]([^'"]+)['"]/;
              chunkName = leadingComments.match(regexp)[1];
            }

            console.log(`遍历到有import导入的语句, chunkName = ${chunkName}`);

            pathNode.replaceWithSourceString(
              `__webpack_require__.e("${chunkName}").then(__webpack_require__.t.bind(null, "${depModuleId}", 7))`
            );

            this.blocks.push({
              context: this.context,
              entry: depModuleId,
              name: chunkName, //title
              async: true,
            });
          }
        },
      });

      //把转换后的语法树重新生成代码
      let { code } = generate(this._ast);
      this._source = code; // 覆盖原来的代码

      /**
       * 循环构建每一个通过import异步方式导入的代码块
       * 当所有通过Import方式的导入的代码块，编译完成之后，才表示当前模块index.js编译完成
       */
      neoAsync.forEach(
        this.blocks,
        (block, done) => {
          //done = callback
          let { context, entry, name, async } = block;
          compilation._addModuleChain(context, entry, name, async, done);
        },
        callback
      );

      //callback(err);
    });
  }
  /**
   * @param {*} compilation
   * @param {*} buildCallBack
   */
  doBuild(compilation, buildCallBack) {
    //1.先根据路径读取硬盘上的指定文件的源代码
    this.getSource(compilation, (err, source) => {
      this._source = source; // 读到了源代码
      buildCallBack(err);
    });
  }
  /**
    compilation.options = compiler.options;
    compilation.inputFileSystem = compiler.inputFileSystem; //读文件系统
    compilation.outputFileSystem = compiler.outputFileSystem; //写文件系统
  */
  getSource(compilation, doBuildCallBack) {
    //let codeFilePath = path.join(compilation.context,compilation.options.entry);
    let code = compilation.inputFileSystem.readFile(
      this.resource,
      "utf8",
      doBuildCallBack
    );
  }
}
exports = module.exports = NormalModule;

/**
## webpack 整个编译代码块的过程
- 1. 通过fs系统，从硬盘上把模块内容读出来，读成一个文本
- 2. 可能它不是一个JS模块， 所以会可能要走loader的转换，比如babel-loader ,最终会得到一个js模块代码
- 3. 把这个js模块代码经过parser(比如 @babel/parser, babylon)  转换成抽象语法树ast
- 4. 分析ast语法树里面的依赖(比如代码中import，require语句) 
- 5. 递归的编译依赖的模块，解决依赖模块中的的所有依赖，知道没有依赖为止
- 6. 不停的一次递归执行上面5步，知道所有的模块都编译完成  
*/
