//const webpack = require("webpack"); //引入官方的webpack

const webpack = require('./myWebpack'); //引入自己写的webpack

const webpackOptions = require("./webpack.config");
console.log('0.webpack.config.js配置的参数 = ',webpackOptions);
const compiler = webpack(webpackOptions);


debugger;
compiler.run((err, statsInstance) => {
  console.log(err);
  let obj = statsInstance.toJson({
    entries: true, //编译的入口文件
    chunks: true, //代码块
    modules: true, //打包模块的数组
    assets: true, //打包后的产出的文件
  });
  console.log("3.编译结果，obj = ", obj);
});
