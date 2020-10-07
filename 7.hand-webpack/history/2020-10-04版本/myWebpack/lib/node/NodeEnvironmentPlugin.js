const fs = require('fs');
class NodeEnvironmentPlugin {
    constructor(options){

    }
    apply(compiler){
        compiler.inputFileSystem = fs;  // 读文件用哪个模块 fs.readFile
        compiler.outputFileSystem = fs; // 写文件用哪个模块 fs.wrirteFile
    }
}

exports = module.exports = NodeEnvironmentPlugin;