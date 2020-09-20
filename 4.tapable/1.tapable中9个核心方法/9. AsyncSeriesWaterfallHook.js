/**
 * 上一个注册函数的不为undefined的结果 作为下一个函数的一个参数的的值
 */
let { AsyncSeriesWaterfallHook } = require("tapable");

let hook = new AsyncSeriesWaterfallHook(["NAME"]);

/*
console.time("cost");
hook.tapAsync("A", (name, cb) => {
  setTimeout(() => {
    console.log("A", name);
    //cb();
    cb(null, "A"); //上一个注册函数的不为undefined的结果 作为下一个函数的一个参数的的值
  }, 1000);
});
hook.tapAsync("B", (name, cb) => {
  setTimeout(() => {
    console.log("B", name);
    //cb();
    //cb(null, 'B'+name);
    cb('error','出错了，本钩子上的顺序注册的其他函数会被终止执行');
  }, 2000);
});

hook.tapAsync("C", (name, cb) => {
  setTimeout(() => {
    console.log("C", name);
    cb();
    //cb(null, "C");
  }, 3000);
});

hook.callAsync("anyName", (error, data) => {
  console.log("回调函数,data=", data);
  console.timeEnd("cost");
});
*/

console.time("promise");
hook.tapPromise("A", (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("promise_A");
      resolve();
    }, 1000);
  });
});
hook.tapPromise("B", (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("promise_B");
      //resolve('break');
      reject('fail');
    }, 2000);
  });
});

hook.tapPromise("A", (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("promise_C");
      resolve();
    }, 3000);
  });
});

hook.promise("anyName").then((data) => {
  console.log("data= ", data);
  console.timeEnd("promise");
},(error)=>{
    console.log('失败了,失败信息为:=',error);
    console.timeEnd("promise");
});

