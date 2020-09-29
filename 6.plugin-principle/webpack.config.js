const path = require('path');
const SyncDonePlugin = require('./plugins/SyncDonePlugin');
const AsyncDonePlugin = require("./plugins/AsyncDonePlugin");
const AssetPlugin = require("./plugins/AssetPlugin");

const AutoExternalPlugin =  require("./plugins/AutoExteralPlugin");

const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
  },
  devServer:{
    port:3000,
    contentBase:"./dist"
  },
  /*
  externals:{
    "jquery":"jQuery"
  },
  */
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    //new SyncDonePlugin({ name: "同步插件" }),
    //new AsyncDonePlugin({ name: "创建异步插件" }),
    //new AssetPlugin({name:"webpack打包输出打包后内容的钩子"}),
    new HtmlWebpackPlugin({
      template:'./src/index.html'
    }),

    //自定义插件
    new AutoExternalPlugin({
      //key 是模块的名称，值是一个对象expose，次cdn脚本向window挂的变量名，url 是 CDN提供的
      jquery:{
         expose:"$",
         url:"https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.js"
      },
      lodash:{
         expose:"_",
         url:"https://cdn.bootcdn.net/ajax/libs/lodash.js/0.1.0/lodash.js"
      }
    })
  ],
};