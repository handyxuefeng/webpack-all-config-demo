const SingleEntryPlugin = require('./SingleEntryPlugin');
const MultiEntryPlugin = require('./MultiEntryPlugin');



const itemToPlugin = (context, entry, name) => {
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
            if(typeof entry ==='string') {
                itemToPlugin(context, entry, "main").apply(compiler);
            }
            else{
                for(let entryName in entry){
                    if(Object.prototype.hasOwnProperty.call(entry,entryName)) {
                         itemToPlugin(context, entry[entryName], entryName).apply(compiler);
                    }
                }
            }
            
        });
    }
}

exports = module.exports = EntryOptionPlugin;