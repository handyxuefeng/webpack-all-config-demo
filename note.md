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