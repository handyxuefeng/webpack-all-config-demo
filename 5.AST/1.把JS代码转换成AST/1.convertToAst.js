let esprima = require('esprima');//把JS源代码转成AST语法树
let estraverse = require('estraverse');///遍历语法树,修改树上的节点
let escodegen = require('escodegen');//把AST语法树重新转换成代码
let code = `function ast(){console.log('this is abstract sytnax tree');console.log('123')}`;
let ast = esprima.parse(code);
let indent = 0;
function padding(){
    return " ".repeat(indent);
}
estraverse.traverse(ast,{
    //ast的进入方法
    enter(node){
        console.log('node.type =',node.type);
        console.log(padding()+node.type+'进入');
        if(node.type === 'FunctionDeclaration'){
            node.id.name = 'newAst';
        }
        if(node.type === 'Literal') {
            if(node.value) {
                node.value = '这是新添加的内容 ' + node.value;
            }
        }
        indent+=2;
    },

    //ast语法树的离开方法
    leave(node){
        indent-=2;
        console.log(padding()+node.type+'离开');
    }
});
let newCode = escodegen.generate(ast);
console.log(newCode);