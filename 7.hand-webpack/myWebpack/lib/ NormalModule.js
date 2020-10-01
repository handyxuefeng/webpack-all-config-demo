const Parser = require('./Parser');
class  NormalModule {
    /**
     * name = 'main'
     * entry  = './src/index.js'
     * context, = /Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack
     * resource = /Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack/src/index.js
     * parser = @babel/parser ,用来生成抽象语法树
     * @param {*} param0
     */
    constructor({name,entry,context,resource,parser}){
        this.name = name;
        this.entry = entry;
        this.context = context;
        this.resource = resource;

        //把模块内容转换为ast语法树的 解析器，parser 解析器有很多，指定一个就可以
        this.parser = parser; 

        //此模块的代码内容
        this._source;

        //此模块对应的AST抽象语法树
        this._ast ;


        
    }
}
exports = module.exports =  NormalModule;