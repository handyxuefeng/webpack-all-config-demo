const path = require("path");

const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyjsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = {
  //开发服务器的配置
  devServer: {
    port: 3000,
    contentBase: "./dist",
    progress: true, //进度条
    compress: true, //启动压缩
  },
  mode: "development", //打包的模式，开发环境和生产环境都是不一样，开发环境不会压缩
  entry: "./src/index.js", //打包的入口
  output: {
    //打包的出口
    filename: "bundles.js",
    path: path.resolve(__dirname, "dist"), //必须是一个绝对路径
  },
  module: {
    rules: [
      //配置样式文件的处理css-loader 处理css中 @import
      // style-loader  把css插入到head标签中
      // loader的执行顺序是从右至左执行
      // loader 还可以写成对象形式
      {
        test: /\.css$/,
        // 1.第一种配置方式
        use:[
          MiniCssExtractPlugin.loader, //抽离样式
          'css-loader',
          'postcss-loader',
        ],
        exclude:/node_modules/
      },
      //less文件的处理
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader, //抽离样式
          "css-loader", 
          "less-loader",
          'postcss-loader',
        ],
        exclude:/node_modules/
      },
      //sass文件的处理
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ],
        exclude:/node_modules/
      }
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"), //打包的模板
      filename: "index.html", //打包之后的文件名称
      hash: true, //在页面中引用js时，自动给脚本添加hash版本号
      // minify:{
      //   removeAttributeQuotes:false ,//删除双引号
      //   collapseWhitespace:true, //折叠空行
      // },
    }),
    //抽取css文件的插件
    new MiniCssExtractPlugin({
      filename:'main.css'
    }),
    //把抽取的css进行压缩
    new OptimizeCSSAssetsPlugin({}),

    //js文件进行压缩
    new UglifyjsPlugin({
      cache:true,
      parallel:true, //并发
      sourceMap:true
    })
  ],
};
