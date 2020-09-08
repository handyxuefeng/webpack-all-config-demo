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