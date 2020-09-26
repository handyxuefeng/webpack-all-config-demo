class SyncDonePlugin {
  constructor(opts) {
      console.log("初始化同步插件,name = ", opts);
      this.opts = opts;
  }
  //
  /**
   1.每个插件上都要扩展一个apply方法
   compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，
   并配置好所有可操作的设置，包括 options，loader 和 plugin。
   当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。
   可以使用它来访问 webpack 的主环境。
   2.compiler对象上有tapable的所有钩子
   
   * @param {*} compiler
   */
  apply(compiler) {
    console.log("执行插件时，传入的compiler对象可以获取webpack.config.js中所有配置项信息,compiler.options=",compiler.options);
    //done: new AsyncSeriesHook(["stats"]),
    compiler.hooks.done.tap("SyncDonePlugin",()=>{
      console.log("tap SyncDonePlugin");
    });

  }
}

module.exports = SyncDonePlugin;