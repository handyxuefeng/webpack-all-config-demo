/**
 * 1. 同步瀑布钩子
 * 2. 如果上一个函数的返回值不为undefined，则上一个函数的返回值作为下一个函数的一个参数
 * 3. 如果上一函数的返回值为undefined,则沿用上一个事件的返回值
 */
let { SyncWaterfallHook } = require("tapable");
//1.创建钩子
let syncWaterHook = new SyncWaterfallHook(["name", "age"]);

//2.为钩子注册事件
syncWaterHook.tap("eventName", (name, age) => {
  console.log(1, name, age);
  return name;
});

syncWaterHook.tap("syncHook2", (name, age) => {
  console.log(2, name, age,"在钩子上的第二个事件上有返回,则钩子上的其他事件不再执行");
  return name+ "B";
});

syncWaterHook.tap("syncHook3", (name, age) => {
  console.log(3, name, age);
  return name + "C";
});

syncWaterHook.tap("anyEvent", (name) => {
  console.log(4, name);
   return name + "D";
  
});

//3.触发
syncWaterHook.call("A", 10);



