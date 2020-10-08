const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  devtool: false,
  //MPA模式
  entry: {
    index: "./src/index.js",
    home: "./src/home.js",
  },
  optimization: {
    //runtimeChunk:true,
    /**
     * 设置代码块的分割方案
     * chunks = {
     *   all:  表示的是代码中通过同步导入和异步导入的 require('./xx.js') import aa from 'xxx.js' 以及 异步的 import('./a')
     *   initial: 代码中通过require('./xx.js') import aa from 'xxx.js' 同步导入的
     *   async: 代码中通过异步方式导入的 import('./xxx.js')
     * }
     *
     */
    splitChunks: {
      chunks: "all", //默认分割异步代码，这里是设置，是公共的，缓存组cacheGroup中的 vendors 和 commons 配置都能用，
      minSize: 0, //被提前的代码块的最小尺寸 KB,默认是 30KB
      name: true, //设置公共代码块打包后的名称。默认是引用了公共代码的文件名连接起来的命名，如 page1~page2
      //maxAsyncRequests: 3, //同一个入口分割出来的最大异步请求数
      //maxInitialRequests: 5, //同一个入口分割出来的最大同步请求数
      automaticNameDelimiter: "~",
      /**
       * 缓存组规则,设置不同的缓存组来抽取满足不同规则的chunk
       */
      cacheGroups: {
        //第三方的，把符合条件缓存组提取出来放在vendor这个代码块里，vendors主要是提取node_modules中的模块
        vendors: {
          //chunks: "all",
          test: /([\\/]+)node_modules\1/, //筛选条件
          priority: -10, //权重
          name: "library",
        },
        /**
         * default: 表示提取不同的代码块之间的引用了用户自定义的公共代码
         */
        default: {
          minChunks: 2, //表示公共代码被>=2个以上的不同模块引用了，就要提取出来
          priority: -20, //权重
          name: "commons",
          //minSize: 0, //符合被提权代码块的大小，要大于 minSize个字节，默认是30KB,
        },
      },
    },
  },
  output: {
    path: path.posix.resolve(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            //用babel-loader 插件把 es6-10的语法转换es5的配置
            presets: [
              "@babel/preset-env",
              "@babel/preset-react", //解析react语法
            ],
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }], //类装饰器的配置
              ["@babel/plugin-proposal-class-properties", { loose: true }], //支持es7中类的属性高级赋值写法
              ["@babel/plugin-transform-runtime"], //配置支持generate,Promise ,includes 高级API的写法,在脚本中 require('@babel/polyfill');
            ],
          },
        },
        exclude: /node_modules/, //把node_modules模块排除在外
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      filename: "index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      filename: "home.html",
      chunks: ["home"],
    }),
  ],
};
