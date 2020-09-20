
let Hook = require('./Hook');
let SyncHookCodeFactory = require('./HookCodeFactory');

let factory = new SyncHookCodeFactory();

class SyncHook extends Hook {
    constructor(name){
        super(name);
        this.hookName = name;
    }
    complie(options) {
        factory.setup(this,options);
        return factory.create(options);
    }
}


module.exports =  SyncHook;