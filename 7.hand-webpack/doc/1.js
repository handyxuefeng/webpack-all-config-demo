const path = require('path');
let arr = [1,2,3,4,5,6];

for(let item of arr){
    console.log(item);
};

let absoluteFilePath ='/Users/hanxf.han/study/webpack-serial/webpack-all-config-demo/7.hand-webpack/src/title.js'
let root = "/Users/hanxf.han/study/webpack-serial/webpack-all-config-demo/7.hand-webpack";


let relativeFilePath = path.posix.relative(root, absoluteFilePath);
console.log("relativeFilePath=", relativeFilePath);