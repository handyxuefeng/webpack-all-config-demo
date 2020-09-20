/**
 * 1.同步保险丝钩子 SyncBailHook
 * 2. 如果任意一个事件有返回值!=undefined,在终止下面事件的执行
 */
let { SyncBailHook } = require("tapable");
//1.创建钩子
let syncBailHook = new SyncBailHook(["name", "age"]);

//2.为钩子注册事件
syncBailHook.tap("eventName", (name, age) => {
  console.log(1, name, age);
});

syncBailHook.tap("syncHook2", (name, age) => {
  console.log(2, name, age,"在钩子上的第二个事件上有返回,则钩子上的其他事件不再执行");
  return "返回值不为undefined，则钩子上的其他事件不再执行";
});

syncBailHook.tap("syncHook3", (name, age) => {
  console.log(3, name, age);
});

syncBailHook.tap("anyEvent", (name) => {
  console.log("注册到钩子的事件，会被触发", name);
});

//3.触发
syncBailHook.call("jackie", 10);



