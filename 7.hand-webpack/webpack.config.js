const path = require('path');
module.exports = {
    mode:"development",
    devtool:false,
    entry:{
        main:'./src/index.js'
    },
    output:{
        filename:"bundle.js",
        path:path.resolve(__dirname,'dist')
    }
}