## 安装本地开发依赖 webpack，webpack-cli
- yarn add  webpack webpack-cli -D //  -D 模式表示安装开发依赖，上线的时候不需要

## webpack 可进行0配置
- 打包工具 -> 输出后的结果(js模块)

## webpack中样式常见配置
- css-loader 处理样式文件中有@import 这种语法的
- style-loader 把处理后的样式文件插入到页面的head中

```
yarn add css-loader style-loader -D
```

## webapck中常见devtool的配置说明
- source-map        会产生sourcemap文件,报错信息大而全
- eval-source-map   不会产生sourcemap文件
- cheap-module-source-map   不会产生列号，但是会产生一个单独的sourcemap文件
- cheap-module-eval-source-map  不生成文件，也不产生列，集成在打包后的文件中

## 配置webpack的watch
```
module.exports= {
  //配置webpack的watch
  watch: true,
  watchOptions: {
    poll: 1000, //每秒监控一次
    aggregateTimeout: 500, //防抖
    ignored: /node_modules/, // 表示不需要监控这个文件夹
  }
}
```

## webpack 常见插件的使用
- cleanWebpackPlugin  第三方插件
- copyWebpackPlugin 第三方插件
- bannerPlugin webpack内置插件


## webpack 中resolve属性的配置
```
module.exports = {
    //解析第三方包
  resolve: {
    modules: [path.resolve("node_modules")], //让每个解析的包都从node_modules去解析和加载
    //给长路径定义别名
    alias: {
      bootstrap: "bootstrap/dist/css/bootstrap.css",
    },
    extends:['.js','.css','.json'] //import在导入文件时候，省略后缀名时候，一次按照这个来查找
  }
}
```

## 在webpack中通过插件配置环境变量
- 通过webpack自带的插件定义环境变量
```
module.exports = {
  plugins:[
      //在webpack中定义环境变量，方便系统中每个业务逻辑，需要判断环境变量
    new webpack.DefinePlugin({
      DEV:JSON.stringify('production'),
      isMobile:true,
      expression:"10+20+30+40"
    })
  ]
}

在系统的每个业务中，就可以使用这些环境变量直接读取这些变量
```

## webpack性能优化 
- 1.noParse   优化点之一，不去解析某些包依赖关系，加快webpack打包时间

- 2.IgnorePlugin  //比如使用moment插件包时，如果只是用了中文，那么就没有导入使用其他语言包了
  - 2.1 exclude: /node_modules/, //把node_modules模块排除在外
  - 2.2 include:path.resolve('src') //编译js文件只在src
```
module.exports = {
  module:{
    noParse: /jquery/ 优化点之一，不去解析某些包，加快webpack打包时间
    rules:[
      {
        test: /\.js$/,
        exclude: /node_modules/, //把node_modules模块排除在外
        include:path.resolve('src') //编译js文件只在src
        use: {
          loader: "babel-loader",
          options: {
            //用babel-loader 插件把 es6-10的语法转换es5的配置
            presets: [
              "@babel/preset-env",
              "@babel/preset-react" //解析react语法
            ],
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }], //类装饰器的配置
              ["@babel/plugin-proposal-class-properties", { loose: true }], //支持es7中类的属性高级赋值写法
              ["@babel/plugin-transform-runtime"], //配置支持generate,Promise ,includes 高级API的写法,在脚本中 require('@babel/polyfill');
            ],
          },
        }
        
      }
    ]
  }
}
```

- 3. webpack.DllPlugin & webpack.DllReferencePlugin  抽取类库插件，比如可以把react，react-dom 插件抽取出来
  - 3.1 先配置抽取动态链接库的webpack.react.dll.js ，使用webpack.DllPlugin 
  - 3.2 在webpack.config.js中使用webpack.DllReferencePlugin
```
const path = require('path');
const webpack = require('webpack');
module.exports = {
   mode:"development",
   entry:{
      'react_lib':['react','react-dom']
      //test:'./src/testdll.js'
   },
   output:{
      filename:"_dll_[name].js",
      path: path.resolve(__dirname, "testdlldirectory"), //
      library:'_dll_[name]',

     // libraryTarget:'commonjs'  //表示打包出来的js遵循commonjs的规范，默认是var
     // libraryTarget:'umd'  //表示打包出来的js遵循umd的规范
      //libraryTarget:'amd' 

   },
   plugins:[
    /**
     * webpack.DllPlugin 的选项中：
      path 是 manifest.json 文件的输出路径，这个文件会用于后续的业务代码打包；
      name 是 dll 暴露的对象名，要跟 output.library 保持一致；
      context 是解析包路径的上下文，这个要跟接下来配置的 webpack.config.js 一致
     */
      new webpack.DllPlugin({
         path: 'manifest.json',
         name: '_dll_[name]',  //这个名字要和output中配置的library一样
         context: __dirname,
     }),
     
   ]
}
在package.json中配置
{
  "scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server",
    "dll":"webpack --config webpack.react.dll.js"
  }
}
终端运行命令npm run dll 
```
- webpack.config.js中的配置
```
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
    contentBase: "./testdlldirectory",
    progress: true, //进度条
    compress: true, //启动压缩
  },

  mode: "development", //打包的模式，开发环境和生产环境都是不一样，开发环境不会压缩
  devtool: "source-map", //源码映射，会单独生成map文件，
  entry: "./src/extractdll.js",
  output: {
    //打包的出口
    filename: "script/[name].js",
    path: path.resolve(__dirname, "testdlldirectory"), //
    // publicPath: "http://127.0.0.1:8081", //给所有访问的静态资源添加访问的域名,可利用http-server单独起一个服务进行测试
  },


  plugins: [
    //使用dllReferenceDllPlugin引用动态链接库
    new webpack.DllReferencePlugin({
       context:__dirname,
       manifest:require('./manifest.json')
    }) 
  ],
};


```

## 使用happlypack进行多线程打包
```
yarn add happlypack -D
moudule.exports = {
  module:{
     rules:[
       {
         test:/\.js$/,
         use:'Happypack/loader?id=js'
       },
       {
         test:/\.css$/,
         use:'Happypack/loader?id=css'
       }
     ]
  },
  plugins:[
     //使用Happypack实现多线程打包
    new Happypack({
       id:"js",
       use:[
        {
          loader: "babel-loader",
          options: {
            //用babel-loader 插件把 es6-10的语法转换es5的配置
            presets: [
              "@babel/preset-env",
              "@babel/preset-react" //解析react语法
            ],
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }], //类装饰器的配置
              ["@babel/plugin-proposal-class-properties", { loose: true }], //支持es7中类的属性高级赋值写法
              ["@babel/plugin-transform-runtime"], //配置支持generate,Promise ,includes 高级API的写法,在脚本中 require('@babel/polyfill');
            ],
          },
        }
       ]
    }),
    new Happypack({
      id:"css",
      use:[
        "style-loader",
        MiniCssExtractPlugin.loader, //抽离样式
        "css-loader",
        "postcss-loader",
      ]
    })
  ]
}

```


## webpack中js和css的tree-shaking优化

- 在前端使用import语法导入代码，在生产环境下会自动去除没用的代码
- 通过require方式导入的代码，生产环境没有tree-shaking效果，所以建议用import
- webpack在生产环境下，通过import导入的js代码，打包生产环境时， 会自动删除没有用到的代码
- css的tree shaking 可以通过安装 glob-all purifycss-webpack 实现
```
yarn add glob-all purifycss-webpack -D 

```

## AST 各种语言都可以通过对应parse工具，转换为对应的ast
- JavaScript Parser 
  - JavaScript Parser，把 js 源码转化为抽象语法树的解析器。
  - 浏览器会把 js 源码通过解析器转为抽象语法树，再进一步转化为字节码或直接生成机器码。
  - 一般来说每个 js 引擎都会有自己的抽象语法树格式，Chrome 的 v8 引擎，firefox 的 SpiderMonkey 引擎等等，MDN 提供了详细 SpiderMonkey AST format 的详细说明，算是业界的标准。

## 常用的 JavaScript Parser 
- esprima
- traceur
- acorn
- shift

### esprima
  - 通过 esprima 把源码转化为 AST
  - 通过 estraverse 遍历并更新 AST
  - 通过 escodegen 将 AST 重新生成源码
  - astexplorer AST 的可视化工具  astexplorer.net

```
yarn add webpack webpack-cli esprima estraverse escodegen -D

```
