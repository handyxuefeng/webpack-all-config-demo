import "bootstrap";

import "./enviroment";
class SourceMapConfig {
    constructor(){
        console.log('这里console没有写全,可以通过配置的devtool直接映射过来');
    }
}

let a =1;
let source = new SourceMapConfig();

export default SourceMapConfig;