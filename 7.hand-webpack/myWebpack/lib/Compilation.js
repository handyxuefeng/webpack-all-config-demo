
const { SyncHook } = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory');
const normalModuleFactory = new NormalModuleFactory();
const Parser = require('./Parser');

const parser = new Parser();
const path = require('path');
class Compilation {
    constructor(compiler) {
        this.compiler = compiler;
        this.options = compiler.options;
        this.context = compiler.context;  // /Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack
        this.inputFileSystem = compiler.inputFileSystem; //读文件系统
        this.outputFileSystem = compiler.outputFileSystem; //写文件系统
        this.entries = [];//打包入口的数组
        this.modules = [];// 模块的数组，包括打包入口的模块和依赖的模块，也即是所有.js文件都放在这里
        this.hooks = {
            //每次构建完成一个模块后，就会触发此钩子执行
            successed: new SyncHook(['module'])
        }

    }
    /**
     * context = /Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack
     * entry = './src/index.js'
     * name = 'main'
     * callback = finalCallback 编译完成的回调
     * @param {*} context 
     * @param {*} entry 
     * @param {*} name 
     * @param {*} finalCallback 
     */
    addEntry(context, entry, name, finalCallback) {
        this._addModuleChain(context, entry, name, (err, module) => {
            finalCallback(err, module)
        });
    }
    /**
     * 添加模块链，就是通过normalModuleFactory来创建单个单个的模块
     * @param {*} context 
     * @param {*} entry 
     * @param {*} name 
     * @param {*} callback 
     */
    _addModuleChain(context, entry, name, callback) {
        //通过模块工厂创建一个普通的module
        let entryModule = normalModuleFactory.create({
            name,  //main
            entry, // './src/index.js'
            context, // Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack
            resource: path.posix.join(context,entry), // Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack/src/index.js
            parser
        });

        this.entries.push(entryModule);  //给入口模块数组添加一个模块
        this.modules.push(entryModule); // 给普通模块数组添加一个模块

    }
    seal() {

    }
}
exports = module.exports = Compilation;