/**
 * webpack的编译类
 options = {
    mode:"development",
    devtool:false,
    entry:{
        main:'./src/index.js'
    },
    output:{
        filename:"bundle.js",
        path:path.resolve(__dirname,'dist')
    }
}
*/
const path = require("path");
const {
  Tapable,
  AsyncSeriesHook,
  SyncBailHook,
  AsyncParallelHook,
  SyncHook,
} = require("tapable");
const NormalModuleFactory = require("./NormalModuleFactory");
const Compilation = require("./Compilation");
const Stats = require("./Stats");
const mkdirp = require("mkdirp"); //递归创建文件夹

class Compiler extends Tapable {
  constructor(context) {
    super();
    this.context = context;
    console.log("1.传递给Compiler类的参数 =", context);
    this.hooks = {
      done: new AsyncSeriesHook(["stats"]), //当webpack编译完成后，会触发这个钩子
      entryOption: new SyncBailHook(["context", "entry"]),

      thisCompilation: new SyncHook(["compilation", "params"]), //开始一次新的编译
      compilation: new SyncHook(["compilation", "params"]), //创建完成一个新的编译

      beforeRun: new AsyncSeriesHook(["compiler"]), //运行前钩子
      run: new AsyncSeriesHook(["compiler"]),

      beforeCompile: new AsyncSeriesHook(["params"]), //编译前钩子
      compile: new SyncHook(["params"]), //编译钩子
      afterCompile: new AsyncSeriesHook(["compilation"]), //编译完成钩子

      make: new AsyncParallelHook(["compilation"]),

      failed: new SyncHook(["error"]),

      emit: new AsyncSeriesHook(["compilation"]), //发射，写入
    };
  }
  emitAssets(compilation,runCallback){
    //编译完成后，开始把chunks写入到硬盘
    const emitFiles = (err) => {
       const assets = compilation.assets;
       const outputPath = this.options.output.path;
       for(let file in assets){
         let source = assets[file];
         ///Users/hanxf.han/study/webpack-serial/webpack-all-config-demo/7.hand-webpack/dist/bundle.js
         let targetPath = path.posix.join(outputPath, file);
         this.outputFileSystem.writeFileSync(targetPath, source, "utf8");
       }
       runCallback();
    };

    this.hooks.emit.callAsync(compilation, () => {
      //先创建文件输出目录dist，再写入内容
      console.log("this.options.output.path = ", this.options.output.path);
      mkdirp(this.options.output.path, emitFiles);
    });
  }
  run(callback) {
    console.log("2.webpack 开始编译");
    const onCompiled = (err, compilation) => {
       this.emitAssets(compilation,err=>{
         let stats = new Stats(compilation);
         this.hooks.done.callAsync(stats,err=>{
            callback(err,stats);
         });
       });
    }

    //1.先触发beforeRun的钩子
    this.hooks.beforeRun.callAsync(this, (error) => {
      //2.触发run钩子
      this.hooks.run.callAsync(this, (err) => {
        this.compile(onCompiled);
      });
    });
  }

  compile(onCompiled) {
    const params = this.newCompilationParams();
    /**
     *  beforeCompile: new AsyncSeriesHook(["params"]), //编译前钩子
     *  1.通过callAsync方法触发beforeCompile 钩子
     */
    this.hooks.beforeCompile.callAsync(params, (err) => {
      /**
       * compile: new SyncHook(["params"]), //编译钩子
       * 2.触发同步的complie钩子
       */
      this.hooks.compile.call(params);
      const compilation = this.newCompilation(params); // 创建一次新的编译

      /**
       *  make: new AsyncParallelHook(["compilation"]),
       *  3.触发compiler.make钩子
       */
      this.hooks.make.callAsync(compilation, (err) => {
        console.log("make 完成");
        //开始封装chunk
        compilation.seal((err) => {
          //触发编译完成的钩子
          this.hooks.afterCompile.callAsync(compilation, (err) => {
            onCompiled(err, compilation);
          });
        });
      });
    });
  }
  newCompilation(params) {
    const compilation = new Compilation(this); // this = compiler

    /**
     *  thisCompilation: new SyncHook(["compilation", "params"]), //开始一次新的编译
     *  compilation: new SyncHook(["compilation", "params"]), //创建完成一个新的编译
     *  触发compiler上的下面两个钩子
     */
    this.hooks.thisCompilation.call(compilation, params);
    this.hooks.compilation.call(compilation, params);

    return compilation;
  }
  newCompilationParams() {
    let params = {
      normalModuleFactory: new NormalModuleFactory(), //TODO
    };
    return params;
  }
}
exports = module.exports = Compiler;
