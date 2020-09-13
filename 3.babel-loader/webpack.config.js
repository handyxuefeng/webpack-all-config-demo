const path = require("path");
const webpack = require("webpack");

const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin"); //文件管理的插件

const babelLoader = path.join(__dirname,'loaders/babel-loader.js'); //引入自定义的Loader





module.exports = {
  //开发服务器的配置
  devServer: {
    port: 3000,
    contentBase: "./dist",
    progress: true, //进度条
    compress: true, //启动压缩
  },
  mode: "development", //打包的模式，开发环境和生产环境都是不一样，开发环境不会压缩
  devtool: "source-map",
  //devtool: "hidden-source-map", //判断是生产环境时，可配置改选项
  //devtool: "cheap-module-eval-source-map", //开发环境使用，保留调试时es6的原始写法
  //devtool:'eval',
  //devtool: "eval-source-map",
  //devtool: "inline-source-map",
  //devtool: "cheap-module-source-map",
  //devtool: false, // 判断是生产环境时，可配置改选项

  entry: "./src/index.js", //打包的入口
  output: {
    //打包的出口
    filename: "bundles.js",
    path: path.resolve(__dirname, "dist"), //必须是一个绝对路径
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'source-map-loader',
            options: {},
          },
        ],
        enforce:'pre',
        exclude: /node_modules/,
      },

      //js文件的编译
      {
        test: /\.js$/,
        use: [
          {
            loader: babelLoader,
            options: {},
          },
        ],
        exclude: /node_modules/,
      },
      
      //这个是官方babel-loader，对es6-10的转义
      /*
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"]
          }
        }],
        exclude:/node_modules/i
      },
      */
    
      //配置样式文件的处理css-loader 处理css中 @import
      // style-loader  把css插入到head标签中
      // loader的执行顺序是从右至左执行
      // loader 还可以写成对象形式
      {
        test: /\.css$/,
        // 1.第一种配置方式
        use: [
          MiniCssExtractPlugin.loader, //抽离样式
          "css-loader",
          "postcss-loader",
        ],
      },
      //less文件的处理
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader, //抽离样式
          "css-loader",
          "less-loader",
          "postcss-loader",
        ],
      },
      //sass文件的处理
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
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
    new MiniCssExtractPlugin({
      filename: "main.css",
    }),

    // //使用webpack内置的sourceMap插件
    // new webpack.SourceMapDevToolPlugin({
    //   append: "//# sourceMappingURL=http://127.0.0.1:8080/[url]",
    //   filename: "[file].map",
    // }),

    // //打包完毕之后移动sourceMap文件到指定的目录
    // new FileManagerPlugin({
    //   onEnd: {
    //     copy: [
    //       {
    //         source: "./dist/**/*.map",
    //         destination: process.cwd() + "/sourcemapFile",
    //       },
    //     ],
    //     //打包好之后，删除dist目录下生成的map文件
    //     delete: ["./dist/**/*.map"],
    //     archive: [
    //       {
    //         source: "./dist",
    //         destination: process.cwd() + "/archives/project.zip",
    //       },
    //     ],
    //   },
    // }),
  ],
};
