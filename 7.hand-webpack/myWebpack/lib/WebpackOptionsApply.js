const OptionsApply = require('./OptionsApply');
const EntryOptionPlugin = require('./node/EntryOptionPlugin');

class WebpackOptionsApply extends OptionsApply {
    constructor(){
        super();
    }
    /**
     * 实现父类OptionsApply中的process方法
     * @param {*} options 
     * @param {*} compiler 
     * compiler.hooks = {
            done: new AsyncSeriesHook(["stats"]),  //当webpack编译完成后，会触发这个钩子
			entryOption: new SyncBailHook(["context", "entry"])
        }
     */
    process(options, compiler) {
        new EntryOptionPlugin().apply(compiler); //注册插件

        /**
         * 触发钩子
         * context  上下文路径，跟目录
         * entry:'./src/index.js'
         */
        compiler.hooks.entryOption.call(options.context,options.entry); 
    }
    
}
exports = module.exports = WebpackOptionsApply;