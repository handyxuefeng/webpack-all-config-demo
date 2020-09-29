let Compiler = require('./Compiler');  
let NodeEnvironmentPlugin = require('./node/NodeEnvironmentPlugin'); //引入文件系统插件
const webpack = (options, callback) => {
    let compiler = new Compiler(options);  //1.创建一个compiler实列
    compiler.options = options;  //2. 把webpack.config.js的配置项赋给compiler.options
    let  nodeEnvironmentPlugin = new NodeEnvironmentPlugin(options);
    nodeEnvironmentPlugin.apply(compiler);  //给compiler对象增加文件系统的读写能力

    //3. 给webpack.config.js中plugins配置项目中的所有插件的apply方法，都挂载compiler对象
    if(options.plugins && Array.isArray(options.plugins)) {
        
    }



}

exports = module.exports = webpack;