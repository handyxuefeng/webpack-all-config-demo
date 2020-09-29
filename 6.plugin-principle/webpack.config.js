const path = require('path');
const SyncDonePlugin = require('./plugins/SyncDonePlugin');
const AsyncDonePlugin = require("./plugins/AsyncDonePlugin");
const AssetPlugin = require("./plugins/AssetPlugin");

const AutoExternalPlugin = require("./plugins/AutoExteralPlugin");

const HashPlugin = require("./plugins/HashPlugin");

const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
    page1: "./src/page1.js",
    page2: "./src/page2.js"
   //main:"./src/import.js"
  },
  devServer: {
    port: 3000,
    contentBase: "./dist"
  },
  /*
  externals:{
    "jquery":"jQuery"
  },
  */
  output: {
    //filename: "[name].[hash].js",
    //filename: "bundle.[name].[hash].js",
    //filename: "bundle.[name].[chunkHash].js",
    filename: "[name].[contentHash].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    //new SyncDonePlugin({ name: "同步插件" }),
    //new AsyncDonePlugin({ name: "创建异步插件" }),
    //new AssetPlugin({name:"webpack打包输出打包后内容的钩子"}),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename:"index.html",
      chunks:[`main`],
      hash:true
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename:"page1.html",
      chunks:[`page1`],
      hash:true
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename:"page2.html",
      chunks:[`page2`],
      hash:true,
    }),



    //自定义插件
    new AutoExternalPlugin({
      //key 是模块的名称，值是一个对象expose，次cdn脚本向window挂的变量名，url 是 CDN提供的
      jquery: {
        expose: "$",
        url: "https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.js"
      },
      lodash: {
        expose: "_",
        url: "https://cdn.bootcdn.net/ajax/libs/lodash.js/0.1.0/lodash.js"
      }
    }),

    //自定义hash组件
    new HashPlugin({
      name: "自定义hash组件"
    })



  ],
};