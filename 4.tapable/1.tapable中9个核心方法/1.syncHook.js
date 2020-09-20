/**
 * 1.同步钩子 syncHook
 * 2.参数列表要给全，因为当触发函数时，取实参的时候数量就是这个定义数组的数量来取的
 * 3.tap中的第一个参数可以随便命名，展示个开发人员指导给钩子挂载这个事件
 * 4.创建钩子时，数组的里的名字也是任意命名的
 */
let {SyncHook} = require('tapable');
//1.创建钩子
let hook = new SyncHook(["name","age"]);

//2.为钩子注册事件
hook.tap("eventName",(name,age)=>{
    console.log(1,name,age)
});

hook.tap("syncHook2", (name, age) => {
  console.log(2, name, age);
});

hook.tap("syncHook3", (name, age) => {
  console.log(3, name, age);
});

hook.tap("anyEvent",(name)=>{
    console.log("注册到钩子的事件，会被触发",name);
});

//3.触发
hook.call("jackie",10);



