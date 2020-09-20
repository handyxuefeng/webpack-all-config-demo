let {AsyncSeriesBailHook} = require('tapable');

let hook = new AsyncSeriesBailHook(["NAME"]);


console.time("cost");
hook.tapAsync("A", (name, cb) => {
  setTimeout(() => {
    console.log("A", name);
    cb();
    //cb(null, "A");
  }, 1000);
});
hook.tapAsync("B", (name, cb) => {
  setTimeout(() => {
    console.log("B", name);
     cb();
    cb('error')
  }, 2000);
});

hook.tapAsync("C", (name, cb) => {
  setTimeout(() => {
    console.log("C", name);
     cb();
    //cb(null, "C");
  }, 3000);
});

hook.callAsync("AsyncSeriesHook", (error, data) => {
  console.log("回调函数,data=", data);
  console.timeEnd("cost");
});



/*
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
       resolve('break');
      //reject('fail');
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
*/
