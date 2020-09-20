let { AsyncParallelHook } = require('tapable');
let asyncParalleHook = new AsyncParallelHook(["name"]);
/**
 * 1. 通过tap注册事件
 */
asyncParalleHook.tap("A",(name)=>{
     console.log("A", name);
});
asyncParalleHook.tap("B", (name) => {
  console.log("B", name);
});
asyncParalleHook.tap("C", (name) => {
  console.log("C", name);
});

asyncParalleHook.callAsync("AsyncParalleHook",(data)=>{
    console.log('回调函数,data = ',data);
});
