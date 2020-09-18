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
//const runLoaders = require('./loader-runner'); //webpack自带的
//let request = '-!inline-loader1!inline-loader2!./src/index.js?k=1#top';
let request = 'inline-loader1!inline-loader2!./src/index.js';

//let inlineLoaders = request.split('!');//[inline-loader1,inline-loader2,./index.js]

//最前面的前缀去掉,多个!合并成一个
let inlineLoaders = request.replace(/^-?!+/, "").replace(/!!+/g, "!").split("!");

let resource = inlineLoaders.pop(); //获取要加载资源的入口 resource = './index.js'

console.log('resource=',resource);

const resolveLoaderPath = (loader) => path.resolve(loadDir, loader);
/**
 * 得到每个要loader1,loader2文件的绝对路径
 * inlineLoaders =  [
  '/Users/hanxf.han/study/webpack-serial/webpack-all-config-demo/3.babel-loader/src/loaders/inline-loader1',
  '/Users/hanxf.han/study/webpack-serial/webpack-all-config-demo/3.babel-loader/src/loaders/inline-loader2'
]
*/
inlineLoaders = inlineLoaders.map(resolveLoaderPath);

let rules = [
  {
    test: /\.js$/,
    enforce:"normal",
    use: ["normal-loader1", "normal-loader2"],
  },

  {
    enforce: "post",
    test: /\.js$/,
    use: ["post-loader1", "post-loader2"],
  },
  {
    enforce: "pre",
    test: /\.js$/,
    use: ["pre-loader1"],
  },
  {
    enforce: "pre",
    test: /\.js$/,
    use: ["pre-loader2"],
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

let allLoaders = [];
if(request.startsWith("!!")){  //不要前后置和普通 loader,只要内联 loader
  allLoaders = inlineLoaders;
}
else if(request.startsWith("-!")){//不要前置和普通loader
  allLoaders = [...postLoaders,...inlineLoaders];
}
else if(request.startsWith('!')) { //不要普通 loader
  allLoaders =[...postLoaders,...inlineLoaders,...preLoaders]
}
else{
  allLoaders = [
    ...postLoaders,
    ...inlineLoaders,
    ...normalLoaders,
    ...preLoaders,
  ]
}




//console.log('allLoaders=',allLoaders);



let cacheMap = {};

//开始加载所有的loaders
runLoaders({
  loaders: allLoaders,
  resource:path.resolve(__dirname,resource),
  readResource: fs.readFile.bind(fs)
},(error,data)=>{
 // console.log("data=", data, "error,", error);
   if(data.cacheable){
      cacheMap[path.join(__dirname,resource)]=data.result;
    } 
});

console.log("cacheMap=", cacheMap);