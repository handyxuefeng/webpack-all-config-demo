const fs = require('fs');
const path = require('path');
const readFile = fs.readFile.bind(fs);
const PATH_QUERY_FRAGMENT_REGEXP = /^([^?#]*)(\?[^#]*)?(#.*)?$/;

const testResoure = '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/src/index.js?name=jackie#top';
/**
 * resource= /Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/src/index.js?name=jackie#top
 * @param {*} resource 
 * parseObj= {
  path: '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/src/index.js',
  query: '?name=jackie',
  fragment: '#top'
}
*/
function parsePathQueryFragment(resource) {
    let result = PATH_QUERY_FRAGMENT_REGEXP.exec(resource);
    let parseObj = {
        path:result[1] , //path = /Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/src/index.js
        query:result[2], //?name=jakcie
        fragment:result[3],
    }
    console.log('parseObj=',parseObj);
    return parseObj;
   

}


/**
loaders= [
    '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/post-loader1.js',
    '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/post-loader2.js',
    '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/inline-loader1.js',
    '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/inline-loader2.js',
    '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/normal-loader1.js',
    '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/normal-loader2.js',
    '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/pre-loader1.js',
    '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/pre-loader2.js'
]
 * @param {*} loaders 
 */
function createLoaderObject(loader) {
    let obj = {
        path:'',
        query:null,
        fragment:null,
        normal:null ,//当前loader的normal函数
        pitch:null, //当前loader的pitch函数
        raw:null,  //是否是buffer
        data:null, //自定义对象，每个loader都会有一个data自定义对象
        pitchExecuted:false,// 当前loader的pitch函数是否被执行过
        normalExecuted:false ,// 当前loader的normal函数是否被执行过
    }

    Object.defineProperty(obj,'request',{
        get(){
             return obj.path + obj.query;
        },
        set(newValue){
            let splittedResource = parsePathQueryFragment(newValue);
            obj.path = splittedResource.path;
            obj.query = splittedResource.query;
            obj.fragment = splittedResource.fragment;
        }
    });

    obj.request = loader;



}




/**
 * 
 * @param {*} options ={
    loaders,
    resource,
    readResource,
  }
 * @param {*} callback 
 */
function runLoaders (options,callback) {
    //要加载资源的绝对路径
    let resource = options.source ;// /Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/src/index.js
    let loaders = options.loaders || [];//let allLoaders = [postLoaders,inlineLoaders,normalLoaders,preLoaders];

    //loader执行对象的上下文对象，和this指针
    let loaderContext = {} ;// 
    let readSource = options.readResource || readFile //此方法用来读文件内容
    let splittedResource = parsePathQueryFragment(resource);

    let path = splittedResource.path;  //路径
    let query = splittedResource.query; //查询参数
    let fragment = splittedResource.fragment; //片段，url中的hash值

    let contextDirectory = path.dirname(path);// 获得index.js所在的目录

    /**
     * loaders= [
        '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/post-loader1',
        '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/post-loader2',
        '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/inline-loader1',
        '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/inline-loader2',
        '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/normal-loader1',
        '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/normal-loader2',
        '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/pre-loader1',
        '/Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/loaders/pre-loader2'
    ]
    */
    let loaders = loaders.map(createLoaderObject);




    

}