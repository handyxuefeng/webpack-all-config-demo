const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  context: process.cwd(), //文件根目录
  mode: "development",
  devtool: false,
  // entry:{
  //     main:'./src/index.js'
  // },
  //entry: "./src/index.js", //spa模式
  entry: {
    page1: "./src/page1.js",
    page2: "./src/page2.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js", //打包同步代码，就是代码中通过require方式导入的
    chunkFilename: "[name].js", //打包异步代码，就是代码中通过import方式导入的
  },
  //对应模块的loader部分
  module: {
    rules: [{}],
  },
  //插件部分
  plugins: [
    
  ],
};
