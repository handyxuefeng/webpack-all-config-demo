
const { SyncHook } = require('tapable');
const path = require("path");
const NormalModuleFactory = require('./NormalModuleFactory');
const normalModuleFactory = new NormalModuleFactory();
const Parser = require('./Parser');
const neoAsync =  require('neo-async'); //类似promise-all的工具
const ejs = require('ejs');
const fs = require('fs');
const parser = new Parser();
const Chunk = require('./Chunk');

const mainTemplate = fs.readFileSync(path.posix.join(__dirname,'template','main.ejs'),'utf8');
const EjsRender = ejs.compile(mainTemplate);

//支持splitChunk的模板
const splitChunkTemplate = fs.readFileSync(path.posix.join(__dirname,'template','defererSplitChunkTemplate.ejs'),'utf8');
const DefererSplitChunkRender = ejs.compile(splitChunkTemplate);


const chunkTemplate = fs.readFileSync(path.posix.join(__dirname,'template','chunkTemplate.ejs'),'utf8');
const chunkRender = ejs.compile(chunkTemplate);


class Compilation {
  constructor(compiler) {
    this.compiler = compiler;
    this.options = compiler.options;
    this.context = compiler.context; // /Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack
    this.inputFileSystem = compiler.inputFileSystem; //读文件系统
    this.outputFileSystem = compiler.outputFileSystem; //写文件系统
    this.entries = []; //打包入口的数组
    this.modules = []; // 模块的数组，包括打包入口的模块和依赖的模块，也即是所有.js文件都放在这里
    this._modules = {}; // key = moduleId   值为对应模块的源代码
    this.chunks = [];
    this.files = []; //这里存放本次编译产生的所有文件名
    this.assets = {};
    this.vendors = [];//放着所有的第三方模块 isarray
    this.commons = [];//这里放着同时被多个代码块加载的模块  title.js
    this.moduleCount= {};//可以记录每个模块被代码块引用的次数,如果大于等于2,就分离出到commons里
    this.hooks = {
      //每次构建完成一个模块后，就会触发此钩子执行
      succeed: new SyncHook(["module"]),
      //封装代码的构造钩子
      seal: new SyncHook([]),

      //封装chunk之前
      beforeChunks: new SyncHook([]),

      //封装chunk之后
      afterChunks: new SyncHook(["chunks"]),
    };
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
    this._addModuleChain(context, entry, name, false, (err, module) => {
      finalCallback(err, module);
    });
  }

  /**
   * 添加模块链，就是通过normalModuleFactory来创建单个单个的模块
   * @param {*} context
   * @param {*} entry
   * @param {*} name
   * @param {*} async 是否是异步
   * @param {*} callback
   */
  _addModuleChain(context, entry, name, async, addEntryCallback) {
    /**
     data ={
      name, //main
      entry, // './src/index.js'
      context, // Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack
      resource: path.posix.join(context, entry), // Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack/src/index.js
      parser,
    }
    */
    let data = {
      name,
      entry,
      context,
      resource: path.posix.join(context, entry),
      parser,
      async
    };
    this.createModule(
      data,
      (entryModule) => {
        this.entries.push(entryModule); // 给普通模块数组添加一个模块
      },
      addEntryCallback
    );
  }
  /**
   * 创建并编译一个模块
   * @param {*} data  要编译的模块信息
   * @param {*} addEntry 可选的增加入口的方法，如果这个模块是入口模块，则执行这个方法，不是的入口模块，则不执行
   * @param {*} callback  编译完成之后，回调
   */
  createModule(data, addEntry, addEntryCallback) {
    //通过模块工厂创建一个普通的module

    let newModule = normalModuleFactory.create(data);

    addEntry && addEntry(newModule); //如果是入口模块./src/index.js  则执行该方法
    this.modules.push(newModule); // 给普通模块数组添加一个模块
    this._modules[newModule.moduleId] = newModule;

    const afterBuild = (err, module) => {
      //TODO 这里要解析和编译在代码中依赖的模块，也就是通过import，require形式导入的依赖

      //如果index.js文件中存在依赖，则继续分析依赖的模块是否还存在嵌套依赖
      if (module.dependencies && module.dependencies.length > 0) {
        this.processModuleDependencies(module, (error) => {
          addEntryCallback(error, module);
        });
      } else {
        return addEntryCallback(err, module);
      }
    };

    this.buildModule(newModule, afterBuild);
  }

  /**
   * 处理依赖的模块，比如index.js 里面导入额require('./title.js'),
   * 那就是index 依赖了 title
   * @param {*} module
   * @param {*} callback
   */
  processModuleDependencies(module, callback) {
    // 1.获取模块的所有依赖项数组
    let dependencies = module.dependencies;

    //遍历所有的依赖模块，全部开始编译，类似于AsyncParallelHook 异步并行钩子
    neoAsync.forEach(
      dependencies,
      (dependency, done) => {
        let {
          name,
          context,
          rawRequest,
          moduleId,
          dependModuleAbsolutePath,
          resource,
        } = dependency;
        let data = {
          name,
          entry: rawRequest,
          context,
          resource,
          moduleId,
          parser,
        };
        this.createModule(data, null, done);
      },
      callback
    );
  }

  buildModule(entryModule, afterBuildCallback) {
    //模块的编译过程实际上是在模块的内部完成的，build方法为moudle内部的方法
    entryModule.build(this, (err) => {
      //走到这一步，表示一个模块已经完成，可以调用回调函数了
      this.hooks.succeed.call(entryModule);

      //调用afterBuildCallback时，代码的源码和ast语法树都已经生成
      console.log("代码的源码为=", entryModule._source);

      //console.log("代码的源码为=", entryModule._source,'代码的语法树为:',entryModule._ast);
      afterBuildCallback(err, entryModule);
    });
  }
  /**
   * 封装代码chunk
   * @param {*} callback
   */
  seal(callback) {
    this.hooks.seal.call();
    this.hooks.beforeChunks.call(); // 开始准备封装代码块

    /**
     * 开始遍历modules中所有模块，区分哪些是要放到vendors里面，哪些是要放到commons里面
     */
     for(let module of this.modules){
       let moduleId = module.moduleId;
       //如果模块ID中有node_modules内容,说明是一个第三方模块
       if (/node_modules/.test(moduleId)) {
         module.name = 'vendors';
         if(this.vendors.length==0){
            this.vendors.push(module);
         }
         else{
          this.vendors.forEach(item=>{
            //避免重复放入
            if (item.moduleId !== module.moduleId) {
              this.vendors.push(module);
            }
          });
        }
       }else{
         //this.moduleCount= {}
          let count = this.moduleCount[module.moduleId];
          if (count) {
            this.moduleCount[module.moduleId].count++;
          } else {
            //如果没有,则给它赋初始值 {module,count} count是模块的引用次数
            this.moduleCount[module.moduleId] = { module, count: 1 };
          }
       }
     }
    
   
    /**
     * 统计每个代码块出现的次数，如果超如果webpack.config.js中配置的额次数
     * 则提取到commons数组中
     */
    for(let moduleId in  this.moduleCount) {
       const { module, count } = this.moduleCount[moduleId];
       if (count >= 2) {
         module.name = "commons";
         this.commons.push(module);
       }
    }

    console.log("this.vendors=", this.vendors,'this.commons = ',this.commons);


    let deferredModuleIds  = [...this.vendors,...this.commons].map(module=>module.moduleId);
    this.modules = this.modules.filter(module=>!deferredModuleIds.includes(module.moduleId));


    /**
     * 每个入口会生成一个代码块
     */
    for (const entryModule of this.entries) {
      let chunk = new Chunk(entryModule);
      this.chunks.push(chunk);

      //对所有模块进行过滤，找出本chunk中包含的模块
      chunk.modules = this.modules.filter(
        (module) => module.name === chunk.name
      );
    }
    if (this.vendors.length > 0) {
      const chunk = new Chunk(this.vendors[0]); //根据入口模块得到一个代码块
      chunk.async = true;
      this.chunks.push(chunk);
      //对所有模块进行过滤,找出来那些名称跟这个chunk一样的模块,组成一个数组赋给chunk.modules
      chunk.modules = this.vendors;
    }
    if (this.commons.length > 0) {
      const chunk = new Chunk(this.commons[0]); //根据入口模块得到一个代码块
      chunk.async = true;
      this.chunks.push(chunk);
      //对所有模块进行过滤,找出来那些名称跟这个chunk一样的模块,组成一个数组赋给chunk.modules
      chunk.modules = this.commons;
    }
    this.hooks.afterChunks.call(this.chunks);
    this.createChunkAssets(); //生成代码之后，要生成代码块对应的资源
    callback();
  }

  createChunkAssets() {
    for (let chunk of this.chunks) {
      const filename = chunk.name + ".js"; //得到文件名
      chunk.files.push(filename);
      let source;
      if(chunk.async) {
        source = chunkRender({
          chunkName: chunk.name, // 'title'
          modules: chunk.modules, //[{moduleId:'./src/index.js'},{moduleId:'./src/title.js'}]
        });
      }
      else{
        let deferredChunks = [];
        if (this.vendors.length > 0) deferredChunks.push(`"vendors"`);
        if (this.commons.length > 0) deferredChunks.push(`"commons"`);
        /*
        source = EjsRender({
          entryModuleId: chunk.entryModule.moduleId, // './src/index.js'
          modules: chunk.modules, //[{moduleId:'./src/index.js'},{moduleId:'./src/title.js'}]
        });
        */
       source = DefererSplitChunkRender({
         deferredChunks,
         entryModuleId: chunk.entryModule.moduleId, // './src/index.js'
         modules: chunk.modules, //[{moduleId:'./src/index.js'},{moduleId:'./src/title.js'}]
       });


      }
      
      this.emitAssets(filename, source);
    }
  }

  /**
   * 把代码写入到assets对象中
   * @param {*} filename
   * @param {*} source
   */
  emitAssets(filename, source) {
    this.assets[filename] = source;
    this.files.push(filename);
  }
}
exports = module.exports = Compilation;