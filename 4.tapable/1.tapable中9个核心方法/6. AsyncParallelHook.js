/**
 * AsyncParallelBailHook:异步并行钩子函数
 * 1.此钩子提供三种注册事件的方法
 * a. tap
 * b. tapAsync
 * c. promise
 */

let { AsyncParallelHook } = require("tapable");
/*
let asyncParalleHook = new AsyncParallelHook(["name"]);
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
*/

/**
 * 第二种：通过tapAsync注册事件
 */


let asyncParalleHook2 = new AsyncParallelHook(["name"]);
console.time("cost");
asyncParalleHook2.tapAsync("A", (name, cb) => {
  setTimeout(() => {
    console.log("A", name);
    cb(null,'A');
  }, 1000);
});
asyncParalleHook2.tapAsync("B", (name, cb) => {
  setTimeout(() => {
    console.log("B", name);
     cb(null,'bbbb'); //如果这里传值的话，则表示流程出了问题，会
  }, 2000);
});

asyncParalleHook2.tapAsync("C", (name, cb) => {
  setTimeout(() => {
    console.log("C", name);
     cb(null, "C");
  }, 3000);
});

asyncParalleHook2.callAsync("AsyncParalleHook", (error,data) => {
  console.log("回调函数,data=", data);
  console.timeEnd("cost");
});


/*
let hook = new AsyncParallelHook(["name"]);
console.time("promise");
hook.tapPromise("A", (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("promise_A");
      resolve("A" + name);
    }, 1000);
  });
});
hook.tapPromise("B", (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("promise_B");
      resolve("B" + name);
    }, 2000);
  });
});

hook.tapPromise("A", (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("promise_C");
      resolve("C" + name);
    }, 3000);
  });
});

hook.promise("anyName").then((data) => {
  console.log("data= ", data);
  console.timeEnd("promise");
});

*/
