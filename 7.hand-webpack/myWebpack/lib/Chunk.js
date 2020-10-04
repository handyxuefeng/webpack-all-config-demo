class Chunk {
  constructor(entryModule) {
    this.entryModule = entryModule;  //此代码块的入口模块
    this.name = entryModule.name;
    this.files = [];//这个代码块生成了哪些文件
    this.modules = []; //这个代码块中引用了哪些模块，比如require,import 方式导入的

  }
}

exports = module.exports = Chunk;
