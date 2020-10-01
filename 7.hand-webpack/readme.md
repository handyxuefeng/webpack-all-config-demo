## webpack中插件和loader的说明
- 1.plugins 插件是贯穿整个生命周期
- 2.plugin 分为注册和触发两个环节
- 3.loader和plugin都是在执行过程中交替执行的，不存在谁比谁早的问题


## webpack 整个编译代码块的过程
- 1. 通过fs系统，从硬盘上把模块内容读出来，读成一个文本
- 2. 可能它不是一个JS模块， 所以会可能要走loader的转换，比如babel-loader ,最终会得到一个js模块代码
- 3. 把这个js模块代码经过parser(比如 @babel/parser, babylon)  转换成抽象语法树ast
- 4. 分析ast里面的依赖(比如代码中import，require语句) 
- 5. 递归的编译依赖的模块，解决依赖模块中的的所有依赖，知道没有依赖为止
- 6. 不停的一次递归执行上面5步，知道所有的模块都编译完成
