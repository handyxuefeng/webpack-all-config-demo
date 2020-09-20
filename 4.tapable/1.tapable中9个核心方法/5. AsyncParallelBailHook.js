/**
 * AsyncParallelBailHook:异步并行钩子函数
 * 1.此钩子提供三种注册事件的方法
 * a. tap
 * b. tapAsync
 * c. promise
 */

let { AsyncParallelBailHook } = require("tapable");

/*
let hook = new AsyncParallelBailHook(["name"]);
hook.tap("A", (name) => {
  console.log("A", name);
});
hook.tap("B", (name) => {
  console.log("B", name);
  return "1"; //遇到有返回值，则下面的注册的时间函数不再执行
});
hook.tap("C", (name) => {
  console.log("C", name);
});

hook.callAsync("AsyncParalleHook", (data) => {
  console.log("回调函数,data = ", data);
});
*/

/**
 * 第二种：通过tapAsync注册事件
 */

/*
let hook = new AsyncParallelBailHook(["name"]);
console.time("cost");
hook.tapAsync("A", (name, cb) => {
  setTimeout(() => {
    console.log("A1111", name);
    //cb(null,"aaaa");
    cb();
  }, 1000);
});
hook.tapAsync("B", (name, cb) => {
  setTimeout(() => {
    console.log("B111", name);
    //cb(null, "bbbbb");
    cb();
  }, 2000);
});

hook.tapAsync("C", (name, cb) => {
  setTimeout(() => {
    console.log("C1111", name);
    //cb(null, "ccccc");
    cb();
  }, 3000);
});

hook.callAsync("AsyncParallelBailHook", (error,data) => {
  console.log("回调函数,data=", data);
  console.timeEnd("cost");
});
*/


let hook = new AsyncParallelBailHook(["name"]);
console.time("promise");
hook.tapPromise("A", (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("promise_A");
      resolve();
      //resolve("A" + name);

    }, 1000);
  });
});
hook.tapPromise("B", (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("promise_B");
       resolve();
     // resolve("B" + name);
    }, 2000);
  });
});

hook.tapPromise("A", (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("promise_C");
       resolve();
     // resolve("C" + name);
    }, 3000);
  });
});

hook.promise("anyName").then((data) => {
  console.log("data= ", data);
  console.timeEnd("promise");
});
