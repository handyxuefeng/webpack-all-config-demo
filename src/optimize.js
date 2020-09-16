/**
 * webpack性能优化
 */
import jquery from 'jquery';
import moment from 'moment';

import 'moment/locale/zh-cn';//手动引入中文包

//设置语言
moment.locale('zh-cn');

let r  = moment().endOf('day').fromNow();
console.log('rr = ',r);

