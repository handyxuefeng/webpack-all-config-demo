const path = require('path');
const fs = require('fs');
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
    //console.log('resource=',resource);
    let result = PATH_QUERY_FRAGMENT_REGEXP.exec(resource);
    let parseObj = {
        path:result[1] , //path = /Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/src/index.js
        query:result[2], //?name=jakcie
        fragment:result[3],
    }
    //console.log('parseObj=',parseObj);
    return parseObj;
   

}
//parsePathQueryFragment(testResoure);


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
  //  console.log('createLoaderObject-loader = ',loader);
    let obj = {
        path:'',
        query:'',
        fragment:'',
        normal:null ,//当前loader的normal函数
        pitch:null, //当前loader的pitch函数
        raw:null,  //是否是buffer
        data:null, //自定义对象，每个loader都会有一个data自定义对象
        pitchExecuted:false,// 当前loader的pitch函数是否被执行过
        normalExecuted:false ,// 当前loader的normal函数是否被执行过
    }

    Object.defineProperty(obj,'request',{
        get(){
             return obj.path + obj.query + obj.fragment;
        },
        set(newValue){
            let splittedResource = parsePathQueryFragment(newValue);
            obj.path = splittedResource.path || '';
            obj.query = splittedResource.query || '';
            obj.fragment = splittedResource.fragment || '';
        }
    });
    obj.request = loader;
    return obj;
}

function loadLoader(loader) {
    let module = require(loader.path);
    console.log('75行----loader=',loader,'module=',module);
    loader.normal = module;
    loader.pitch = module.pitch;
    loader.raw = module.raw;
}

/**
 * 迭代每个loader的pitch方法
 * @param {*} processOptions 
 * @param {*} loaderContext 
 * @param {*} _callback 
 */
function iteratePitchingLoaders(options,loaderContext,_callback){
    console.log('88行---开始迭代每个loader中的pitch方法，传入的loaderContext = ',loaderContext);
    //获取当前对js文件编译的loader
    let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
    if(currentLoader.pitchExecuted) { //如果当前的loader.pitchExecute = true ,说明这个loader已经被执行过了，则要开始执行下一个loader
        loaderContext.loaderIndex ++;
        return iteratePitchingLoaders(options,loaderContext,_callback);
    }

    loadLoader(currentLoader);
    let currentLoaderPitchFun = currentLoader.pitch;
    console.log('currentLoaderPitchFun=',currentLoaderPitchFun.toString());
    currentLoader.pitchExecuted = true ;//表示当前loader的pitch函数已经执行过了

    //如果当前的loader不存在pitch函数，则要开始执行下一个loader
    if(!currentLoaderPitchFun){
        return iteratePitchingLoaders(options,loaderContext,_callback);
    }
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
    //console.log('loader-runner-options = ',options);
    //要加载资源的绝对路径
    let resource = options.resource ;// /Users/hanxf.han/project/webpack-all-config-demo/3.babel-loader/src/index.js
    let loaders = options.loaders || [];//let allLoaders = [postLoaders,inlineLoaders,normalLoaders,preLoaders];

    //loader执行对象的上下文对象，和this指针
    let loaderContext = {} ;// 
    let readSource = options.readResource || readFile //此方法用来读文件内容
    //console.log('126-options.resource = ',resource);
    let splittedResource = parsePathQueryFragment(resource);
    let resourcePath = splittedResource.path;  //路径
    let query = splittedResource.query; //查询参数
    let fragment = splittedResource.fragment; //片段，url中的hash值

    let contextDirectory = path.dirname(resource);// 获得index.js所在的目录
    //console.log('获得index.js所在的目录=',contextDirectory);

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
    //准备loader对象数组
    loaders = loaders.map(createLoaderObject);

    //要加载的资源所在目录
    loaderContext.context = contextDirectory;

    loaderContext.loaderIndex = 0;
    loaderContext.loaders = loaders;
    loaderContext.path = resourcePath;
    loaderContext.query= query;
    loaderContext.fragment=fragment;

    //loaderContext.request = './src/index.js' 路径里不包含loader
    Object.defineProperty(loaderContext,'resource',{
        get(){
            return loaderContext.path + loaderContext.query + loaderContext.fragment
        }
    });

    //loaderContext.request = loader1!loader2!loader3!index.js
    Object.defineProperty(loaderContext,'request',{
        get(){
            return loaderContext.loaders.map(l=>l.request).concat(loaderContext.resource).join('!'); 
        }
    });
   
     //剩下的loader 从当前的下一个loader开始取，加上index.js
     Object.defineProperty(loaderContext,'remainingRequest',{
        get(){
            return loaderContext.loaders.slice(loaderContext.loaderIndex+1).map(l=>l.request).concat(loaderContext.resource).join('!');
        }
    });

     //上一个对js文件进行babel编译的loader
     Object.defineProperty(loaderContext,'previousRequest',{
        get(){
            return loaderContext.loaders.slice(0,loaderContext.loaderIndex).map(l=>l.request)
        }
    })

    //当前正在对js进行编译的loader
    Object.defineProperty(loaderContext,'currentRequest',{
        get(){
            return loaderContext.loaders.slice(loaderContext.loaderIndex).map(l=>l.request).concat(loaderContext.resource).join('!');
        }
    });

    //当前loader的query
    Object.defineProperty(loaderContext,'queryStr',{
        get(){
            let loader = loaderContext.loaders[loaderContext.loaderIndex];
            return loader.options || loader.query;
        }
    });

    //当前loader的data
    Object.defineProperty(loaderContext,'data',{
        get(){
            let loader = loaderContext.loaders[loaderContext.loaderIndex];
            return loader.data;
        }
    });
    let processOptions = {
        resoureBuffer :null ,// loader执行的buffer'结果放在这里
        readSource
    };

    //迭代每个loader的pitch 方法
    iteratePitchingLoaders(processOptions,loaderContext,function(err,result){
         if(err){
             return callback(err,{});
         }
         callback(null,{
             result,
             resoureBuffer:processOptions.resoureBuffer
         })
    });
}

module.exports = runLoaders;