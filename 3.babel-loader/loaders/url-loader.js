let path = require("path");

let mime = require('mime');
/**
 * 1.生成一个新的文件名
 * 2.向输出列表里添加一个输出文件
 * @param {*} content
 */
let { getOptions, interpolateName } = require("loader-utils");
function loader(content) {
  console.log("自定义的url-loader=", content);
  //1.选项
  let options = getOptions(this) || {};
  let {limit,fallback='file-loader'} = options; //拿到webpack.config.js中的url-loader的options配置

  if(limit) {
    limit = parseInt(limit,10);  //转换成10进制的整形
  }
  const mimeType = mime.getType(this.resourcePath);  //jpg=>image/jpeg

  if(!limit || content.length<limit) {
    let base64String = `data:image/jpeg;base64,${content.toString('base64')}`;
      return `export default ${JSON.stringify(base64String)}`;
  }
  else{
    let fileLoader = require(fallback || 'file-loader');
    return fileLoader.call(this,content);
  }
  
 


}
//加载的二进制,所以需要让content是Buffer
loader.raw = true;
module.exports = loader;

/* 
function interpolateName(loaderContext,name,options){
    let filename = name||'[hash].[ext]';
    let ext = path.extname(loaderContext.resourcePath).slice(1);
    let hash = require('crypto').createHash('md5').update(options.content).digest('hex');
    filename= filename.replace(/\[hash\]/ig,hash).replace(/\[ext\]/ig,ext);
    return filename;
}
function getOptions(loaderContext) {
    const query = loaderContext.query;
    if (typeof query === 'string' && query !== '') {
      return parseQuery(loaderContext.query);
    }
    if (!query || typeof query !== 'object') {
      return null;
    }
    return query;
}
function parseQuery(query){//?name=zhufeng&age=10
    return query.split('&').reduce((memo,item)=>{
        let [key,value] = item.split('=');
        memo[key]= value;
        return memo;
    },{});
} */
