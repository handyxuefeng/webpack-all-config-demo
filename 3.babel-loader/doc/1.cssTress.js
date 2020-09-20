const fs = require('fs');
const path = require('path');
const cssTree = require('css-tree'); //引入css抽象语法树的包
let cssFilePath = path.join(__dirname,'input.css');

let transformPxToRem = async function (cssFilePath) {
    let cssString = fs.readFileSync(cssFilePath,"utf-8");
    let cssAstTree = cssTree.parse(cssString);

    //遍历语法树的所有节点，并且对每个节点调用函数，并传入node
    cssTree.walk(cssAstTree,function(node){
        console.log("node=", node);
        if(node.type==="Dimension" && node.unit==='px'){
            node.value =node.value / 100;
            node.unit='rem';
        }
    });
    let outputContent = cssTree.generate(cssAstTree);  //把分析后的css语法树重写生成css内容
    
    //写入文件系统
    fs.writeFileSync(path.join(__dirname, "output.css"), outputContent,(error,data)=>{
        console.log("data=", data);
    });
};

transformPxToRem(cssFilePath);