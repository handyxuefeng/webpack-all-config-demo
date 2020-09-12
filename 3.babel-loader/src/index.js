import "./script-min";


import operate from './operate';



let sum =(a,b)=>a+b;
let result = sum(110,220);

setTimeout(() => {
    let promise = operate.getList();
    promise.then((data) => {
      console.log("data = ", data);
    });

}, 2000);

console.log('operate = ',operate, 'result=',result);

