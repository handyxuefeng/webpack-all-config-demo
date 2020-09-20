let SyncHook = require("./syncHook");

let syncHook = new SyncHook("SyncHook");

console.log("syncHook.hookName = ", syncHook.hookName);

module.exports = {
  SyncHook,
};

