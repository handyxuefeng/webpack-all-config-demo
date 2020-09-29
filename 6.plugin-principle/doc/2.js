let {SyncHook,HookMap } = require('tapable');

const keydHook = new HookMap(key=>new SyncHook(['name']));

