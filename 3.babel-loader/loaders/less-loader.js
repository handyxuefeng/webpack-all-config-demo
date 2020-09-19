let less = require('less'); //引入less编译报
function lessLoader(source) {
    console.log('自定义的less-loader，传进来的值为:source = ',source);
    let callback = this.async();
    less.render(source,{filename:this.resource},(error,output)=>{
        console.log("output.css = ",output.css);
        callback(error, output.css);
    });
}

lessLoader.pitch=function(){

}

module.exports = lessLoader;