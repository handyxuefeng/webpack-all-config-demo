const {SyncHook} = require('../tapable'); //引入自定义的tapable

let syncHook = new SyncHook(["name","pp"]);

let fn1 = (name,age)=>{
    console.log(name,age);
};

syncHook.tap("1",fn1);

let fn2 = (name, age) => {
  console.log(name, age);
};

syncHook.tap("2", fn2);



syncHook.call("syncHook",100);