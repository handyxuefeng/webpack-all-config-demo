import {a1,a2} from './export1';
import {mul,div} from './export2'

console.log(a1(),"\n",a2(),'\n',mul(),'\n',div());



/**
 * 1. es module  模式
 *   可以实现静态分析
 *   导入只能在顶层语句出现，导入的模块必须是常量
 */