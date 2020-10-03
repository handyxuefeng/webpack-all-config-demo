let async =  require('neo-async'); //类似promise-all的工具

let arr = [1,2,3];

let _cb = ()=>{
    console.log('this is callback ',Date.now()*1);
    console.timeEnd('cost');
}

console.time('cost');
async.forEach(arr,(item,callback)=>{
 setTimeout(() => {
     console.log(item);
     callback();
 }, item * 1000);
},_cb);