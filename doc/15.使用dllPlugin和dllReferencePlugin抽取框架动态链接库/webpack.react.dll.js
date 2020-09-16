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