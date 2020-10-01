const path = require('path');
module.exports = {
    context:process.cwd(), //文件根目录
    mode:"development",
    devtool:false,
    entry:{
        main:'./src/index.js'
    },
    output:{
        filename:"bundle.js",
        path:path.resolve(__dirname,'dist')
    },
    //对应模块的loader部分
    module:{
        rules:[
            {
                
            }
        ]
    },
    //插件部分
    plugins:[

    ]
}
console.log(process.cwd());