/**
 * loader 的类型
 - pre-loader 前置loader
 - normal-loader 普通loader
 - inline-loader 行内loader
 - post-loader 后置loader
*/

const path = require('path');
const fs = require('fs');
const loadDir = path.resolve(__dirname,'loaders');//loader的目录
const {runLoaders} = require('loader-runner'); //webpack自带的
let request = 'inline-loader1!inline-loader2!./index.js';

let inlineLoaderArr =request.split('!');

let resource = inlineLoaderArr.pop(); //获取要加载资源的入口 resource = './index.js'

//console.log("resource = ", resource, "inlineLoaderArr=", inlineLoaderArr);

const resolveLoaderPath = (loader) => path.resolve(loadDir, loader);
/**
 * 得到每个要loader1,loader2文件的绝对路径
 * inlineLoaderArr =  [
  '/Users/hanxf.han/study/webpack-serial/webpack-all-config-demo/3.babel-loader/src/loaders/inline-loader1',
  '/Users/hanxf.han/study/webpack-serial/webpack-all-config-demo/3.babel-loader/src/loaders/inline-loader2'
]
*/
inlineLoaderArr = inlineLoaderArr.map(resolveLoaderPath);

//console.log("inlineLoaderArr = ", inlineLoaderArr);

let rules = [
  {
    enforce: "pre", //指定loader的类型 前置
    test: /\.js?$/,
    use: ["pre-loader1", "pre-loader2"],
  },
  {
    test: /\.js?$/,
    use: ["normal-loader1", "normal-loader2"],
  },
  {
    enforce: "post", //指定loader的类型 后置
    test: /\.js?$/,
    use: ["post-loader1", "post-loader2"],
  },
];

let preLoaders  = [];
let postLoaders = [];
let normalLoaders = [];

//把rules 对象进行迭代，得到每个loaders的绝对路径

rules.map(item=>{
  let testType = item.test; //testType = /\.js?$/,
  let enforce = item.enforce;
  //  resource = './index.js'
  if (testType.test(resource)) { //匹配到是js类型
     switch (enforce) {
       case "pre":
         preLoaders.push(...item.use);
         break;
       case "post":
         postLoaders.push(...item.use);
         break;
       case "normal":
         normalLoaders.push(...item.use);
         break;
     }
  }
});

//得到每个loader的绝对路径
preLoaders = preLoaders.map(resolveLoaderPath);
postLoaders = postLoaders.map(resolveLoaderPath);
normalLoaders = normalLoaders.map(resolveLoaderPath);

let allLoaders = [...preLoaders, ...postLoaders, ...normalLoaders];


//开始加载所有的loaders
runLoaders({
  loaders: allLoaders,
  resource:path.resolve(__dirname,resource),
  
});