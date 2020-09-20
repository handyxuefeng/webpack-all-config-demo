/**
 * 1. SyncLoopHook：同步循环钩子
 * 2. 如果事件函数的返回值!==undefined,则执行流从当前钩子终端，从整个钩子的事件头开始重新执行
 */
let { SyncLoopHook } = require("tapable");
//1.创建钩子
let syncLoopHook = new SyncLoopHook(["name", "age"]);

let count1=0,count2=0,count3=0,count4=0;


//2.为钩子注册事件
syncLoopHook.tap("1", (name, age) => {
  count1++;
  console.log('A' , count1);
  if(count1==3) {
    return count1;
  }else{
    return ;
  }
});

syncLoopHook.tap("2", (name, age) => {
  count2++;
  console.log("B", count2);
});

syncLoopHook.tap("3", (name, age) => {
  count3++;
  console.log("C", count3);
  if(count3==2){
    return 'C';
  }
  else{
    return ;
  }

});

syncLoopHook.tap("4", (name,age) => {
  count4++;
  console.log("D", count4);
  if(count4==1){
    return 'D';
  }
  

});

//3.触发
syncLoopHook.call("jackie", 10);


/*
let syncLoop = new SyncLoopHook(["name", "f"]);
let x = 0;
syncLoop.tap("all",(ss)=>{
    x++;
    console.log('x = ',x);
    if(x===100){
      return;
    }
    else{
      return x;
    }
});
syncLoop.call("kkk");


*/
