let esprima = require('esprima');
let estraverse = require('estraverse-fb');
let sourceCode = `<h1 id="title"><span>hello</span>world</h1>`;
let ast = esprima.parseModule(sourceCode,{jsx:true,tokens:true});
console.log('ast=',ast);
function padding(){
    return ' '.repeat(ident);
}
let ident = 0;
//开始遍历ast语法树
estraverse.traverse(ast, {
    //语法树节点进入
    enter:(pathNode) => {
        ident+=2;
        console.log(padding() + pathNode.type+"_进入");
    },
    //语法树节点离开
    leave:(pathNode) => {
        ident-=2;
        console.log(padding() + pathNode.type+"_离开");
    }
});
/**
 *  <h1 id="title"><span>hello</span>world</h1>
 *  { type: 'Punctuator', value: '<' },
    { type: 'JSXIdentifier', value: 'h1' },
    { type: 'JSXIdentifier', value: 'id' },
    { type: 'Punctuator', value: '=' },
    { type: 'String', value: '"title"' },
    { type: 'Punctuator', value: '>' },
    { type: 'Punctuator', value: '<' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'Punctuator', value: '>' },
    { type: 'JSXText', value: 'hello' },
    { type: 'Punctuator', value: '<' },
    { type: 'Punctuator', value: '/' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'Punctuator', value: '>' },
    { type: 'JSXText', value: 'world' },
    { type: 'Punctuator', value: '<' },
    { type: 'Punctuator', value: '/' },
    { type: 'JSXIdentifier', value: 'h1' },
    { type: 'Punctuator', value: '>' }
 */






