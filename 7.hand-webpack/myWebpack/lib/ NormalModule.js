const Parser = require('./Parser');
class NormalModule {
  /**
   * name = 'main'
   * entry  = './src/index.js'
   * context, = /Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack
   * resource = /Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack/src/index.js
   * parser = @babel/parser ,用来生成抽象语法树
   * @param {*} param0
   */
  constructor({ name, entry, context, resource, parser }) {
    this.name = name;
    this.entry = entry;
    this.context = context;
    this.resource = resource; //'./src/index.js'的绝对路径

    //把模块内容转换为ast语法树的 解析器，parser 解析器有很多，指定一个就可以
    this.parser = parser;

    //此模块的代码内容
    this._source;

    //此模块对应的AST抽象语法树
    this._ast;
  }
  /**
   * 模块的编译方法
   * @param {*} compilation
   * @param {*} callback
   */
  build(compilation, callback) {
    this.doBuild(compilation, (err) => {
      this._ast = this.parser.parserCode(this._source);//回调到这一步之后，开始把代码变成ast语法树
      callback(err);
    });
  }
  /**
   * @param {*} compilation
   * @param {*} buildCallBack
   */
  doBuild(compilation, buildCallBack) {
    //1.先根据路径读取硬盘上的指定文件的源代码
    this.getSource(compilation,(err,source)=>{
        this._source = source;// 读到了源代码
        buildCallBack(err); 
    });
  }
  /**
    compilation.options = compiler.options;
    compilation.inputFileSystem = compiler.inputFileSystem; //读文件系统
    compilation.outputFileSystem = compiler.outputFileSystem; //写文件系统
  */
  getSource(compilation,doBuildCallBack) {
      //let codeFilePath = path.join(compilation.context,compilation.options.entry);
      let code = compilation.inputFileSystem.readFile(this.resource,'utf8',doBuildCallBack);

  }
}
exports = module.exports =  NormalModule;

/**
## webpack 整个编译代码块的过程
- 1. 通过fs系统，从硬盘上把模块内容读出来，读成一个文本
- 2. 可能它不是一个JS模块， 所以会可能要走loader的转换，比如babel-loader ,最终会得到一个js模块代码
- 3. 把这个js模块代码经过parser(比如 @babel/parser, babylon)  转换成抽象语法树ast
- 4. 分析ast语法树里面的依赖(比如代码中import，require语句) 
- 5. 递归的编译依赖的模块，解决依赖模块中的的所有依赖，知道没有依赖为止
- 6. 不停的一次递归执行上面5步，知道所有的模块都编译完成  
*/