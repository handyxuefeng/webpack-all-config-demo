let less = require('less'); //引入less编译报
function lessLoader(source) {
    console.log('自定义的less-loader，传进来的值为:source = ',source);
    let callback = this.async();
    less.render(source,{filename:this.resource},(err,output)=>{
        //console.log("output.css = ",output.css);

        //callback(error, output.css);
        callback(err, `module.exports = ${JSON.stringify(output.css)}`);
    });
}

lessLoader.pitch=function(){

}

module.exports = lessLoader;

