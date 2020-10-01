/**
 * 单页面打包插件
 */
class SingleEntryPlugin {
    constructor(context, entry, name){
        this.context = context; // /Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack
        this.entry = entry;  //'./src/index.js'
        this.name = name; //name = main | bundle
    }
    apply(compiler){
        /**
         * 使用compiler上面的如下钩子
         * compiler.hooks = {
            compilation: new SyncHook(["compilation", "params"]),
            make: new AsyncParallelHook(["compilation"]),
        }
        */
        compiler.hooks.compilation.tap("SingleEntryPlugin",(compilation,params)=>{
           
        });

        compiler.hooks.make.tapAsync("SingleEntryPlugin",(compilation,callback)=>{
            const {context, entry, name} = this; //解构实列对象上的参数
            //从此入口开始编译，编译入口文件和他的依赖

            console.log('SingleEntryPlugin make start ...........');
            compilation.addEntry(context, entry, name,callback); 
            
        });
    }
}
exports = module.exports = SingleEntryPlugin;