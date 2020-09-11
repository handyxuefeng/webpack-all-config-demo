import Operate, { ACTION ,SET_USER_INFO} from './operate-esmodule-mode.js'; //加载esModule方式编写的代码

import  {name,age} from './title-commonjs-mode';

require('./image');

require('./index.css');
require("./d.less");

require('@babel/polyfill');

let title = require("./title-commonjs-mode"); //加载commonjs模式编写的代码


let sum = (a,b) => a+b;  //需要babel-loader 和 @babel/core @babel/presets-env来解析

function log(target) {
  console.log('用这个函数来装饰类Peson = ',target);
}

@log
class Person {
   name = 'jackie'
   constructor(){

   }
}
let person = new Person();

let isInclude = Operate.sub([8,9]);

function * gen(params) {
   yield 1;
}

console.log(gen().next());


console.log('includes的配置','aaaa'.includes('a'));

let promise = Operate.add();
promise.then(data=>{
  console.log('data =',data);
})






console.log(
  "title =",
  title,
  "Operate=",
  Operate,
  "ACTION=",
  ACTION,
  "SET_USER_INFO=",
  SET_USER_INFO,
  "name=",
  name,
  "age=",
  age,
  'person.name = ',
  person.name,
  'isInclude = ',
  isInclude
);



