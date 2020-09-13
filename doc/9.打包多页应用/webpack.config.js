const path = require("path");

const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyjsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const webpack = require('webpack');



module.exports = {
  //开发服务器的配置
  devServer: {
    port: 3000,
    contentBase: "./multiplePage",
    progress: true, //进度条
    compress: true, //启动压缩
  },
  mode: "development", //打包的模式，开发环境和生产环境都是不一样，开发环境不会压缩

  //MPA开发模式多页打包的配置
  entry: {
    home: "./src/home.js",
    other: "./src/other.js",
  },
  output: {
    //打包的出口
    filename: "script/[name].js",
    path: path.resolve(__dirname, "multiplePage"), //
    // publicPath: "http://127.0.0.1:8081", //给所有访问的静态资源添加访问的域名,可利用http-server单独起一个服务进行测试
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
        use: [
          MiniCssExtractPlugin.loader, //抽离样式
          "css-loader",
          "postcss-loader",
        ],
        exclude: /node_modules/,
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
        exclude: /node_modules/,
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
        exclude: /node_modules/,
      },

      /** js 文件的编译和高级js语法转换为es5 */
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            //用babel-loader 插件把 es6-10的语法转换es5的配置
            presets: ["@babel/preset-env"],
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }], //类装饰器的配置
              ["@babel/plugin-proposal-class-properties", { loose: true }], //支持es7中类的属性高级赋值写法
              ["@babel/plugin-transform-runtime"], //配置支持generate,Promise ,includes 高级API的写法,在脚本中 require('@babel/polyfill');
            ],
          },
        },
        exclude: /node_modules/, //把node_modules模块排除在外
      },

      /**
       * 对css中一些小图片的处理，在多少k的时候，用base64来转化，否则用file-loader来产生真实的图片
       */
      {
        test: /\.(png|jpeg|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              esModule: false,
              // publicPath:"http://www.han.cn", //图片也可指定不同的域名来加载,比如发布到cdn
              outputPath: "/imgs/", //图片打包输出的路径webapp/imgs
              limit: 200 * 1024, //超过200kb之后就通过file-loader来产生真实的图片
            },
          },
        ],
      },

      //解析 html中的图片资源
      {
        test: /\.(htm|html)$/i,
        loader: "html-withimg-loader",
      },
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"), //打包的模板
      filename: "home.html", //打包之后的文件名称
      chunks: ["home"], //制定需要加载哪些打包之后的文件
      hash: true, //在页面中引用js时，自动给脚本添加hash版本号
    }),
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"), //打包的模板
      filename: "other.html", //打包之后的文件名称
      chunks: ["other","home"],//
      hash: true, //在页面中引用js时，自动给脚本添加hash版本号
    }),

    //抽取css文件的插件,打包好的文件放在webapp/css目录下
    new MiniCssExtractPlugin({
      filename: "css/main.css",
    }),
    //把抽取的css进行压缩
    new OptimizeCSSAssetsPlugin({}),

    //js文件进行压缩
    /*
    new UglifyjsPlugin({
      cache:true,
      parallel:true, //并发
      sourceMap:true
    })
    */
  ],
};


/**

 */
