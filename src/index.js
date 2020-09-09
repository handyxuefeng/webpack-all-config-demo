import Operate, { ACTION ,SET_USER_INFO} from './operate-esmodule-mode.js'; //加载esModule方式编写的代码

import {name,age} from './title-commonjs-mode';


require('./index.css');
require("./d.less");

let title = require("./title-commonjs-mode"); //加载commonjs模式编写的代码




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
  age
);

