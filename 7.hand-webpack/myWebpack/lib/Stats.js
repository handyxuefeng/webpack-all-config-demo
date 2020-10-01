class Stats {
  constructor(compilation) {
    this.entries = compilation.entries; //[]打包入口的数组
    this.modules = compilation.modules; // 模块的数组，包括打包入口的模块和依赖的模块，也即是所有.js文件都放在这里
  }
  toJson(){
      return this;
  }
}

exports = module.exports = Stats;
