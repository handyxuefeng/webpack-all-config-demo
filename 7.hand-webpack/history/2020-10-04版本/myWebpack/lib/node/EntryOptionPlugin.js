const SingleEntryPlugin = require('./SingleEntryPlugin');
const MultiEntryPlugin = require('./MultiEntryPlugin');



const itemToPlugin = (context, entry, name) => {
	if (Array.isArray(entry)) {
		return new MultiEntryPlugin(context, entry, name);
	}
	return new SingleEntryPlugin(context, entry, name);
};

class EntryOptionPlugin {
    constructor(){

    }
    /**
     * @param {*} compiler 
     */
    apply(compiler){
        /**
         * compiler.hooks = {
			entryOption: new SyncBailHook(["context", "entry"])
         * }
         * 在钩子上注册事件
         */
        compiler.hooks.entryOption.tap('EntryOptionPlugin',(context,entry)=>{
            itemToPlugin(context, entry, "main").apply(compiler);
        })
    }
}

exports = module.exports = EntryOptionPlugin;