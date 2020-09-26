const path = require('path');
const SyncDonePlugin = require('./plugins/SyncDonePlugin');
const AsyncDonePlugin = require("./plugins/AsyncDonePlugin");
const AssetPlugin = require("./plugins/AssetPlugin");


module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    //new SyncDonePlugin({ name: "同步插件" }),
    //new AsyncDonePlugin({ name: "创建异步插件" }),
    new AssetPlugin({name:"webpack打包输出打包后内容的钩子"}),
  ],
};