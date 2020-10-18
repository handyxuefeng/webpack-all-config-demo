const { MultiCompiler } = require('webpack');
const ASTNode = require('./ASTNode');
let TokenReader = require('./TokenReader');

const NUMBER = 'NUMBER';
const PLUS = 'PLUS';
const MULTIPLY = 'MULTIPLY';
const SUBMINUS = 'SUBMINUS';
const DIVIDER = 'DIVIDER';
const tokensTypeArr = [NUMBER, PLUS, MULTIPLY, SUBMINUS, DIVIDER];


//let sourceCode = `2+3+4`;
let sourceCode = `1+2*6-2/2`;
let regExp = /(\d+)|(\+)|(\*)|(\-)|(\/)/g;

/**
 * 通过正则对源码进行词法分析，得到tokens数组
 * @param {*} sourceCode 
 * result = [
  { type: 'NUMBER', value: '2' },
  { type: 'PLUS', value: '+' },
  { type: 'NUMBER', value: '3' },
  { type: 'MULTIPLY', value: '*' },
  { type: 'NUMBER', value: '4' }
]
 */
function tokenize(sourceCode) {
    let tokens = [];
    for (let i = 0; i < sourceCode.length; i++) {
        let result = regExp.exec(sourceCode);
       // console.log('result=',result);
        let index = result.findIndex((item, idx) => {
            return (idx > 0 && !!item);
        });
        let value = result[0];//
        let type = tokensTypeArr[index - 1];
        tokens.push({ type, value });
    }
    return tokens;
}



/**
 * 把源码转换成ast语法树
 * @param {*} sourceCode  = 2+3*4
 */
function parser(sourceCode) {
    /*
    1.先把代码进行分词，得到tokens数组
    tokens = [
        { type: 'NUMBER', value: '2' },
        { type: 'PLUS', value: '+' },
        { type: 'NUMBER', value: '3' },
        { type: 'MULTIPLY', value: '*' },
        { type: 'NUMBER', value: '4' }
    ]
    */
    let tokens = tokenize(sourceCode);
    console.log('tokens =',tokens);
    

    //2.根据得到的tokens数组，生成一个tokens读取类
    let tokenReader = new TokenReader(tokens);
    console.log(tokenReader);

    /**
     * 3.开始把token转换成ast
     * sourceCode = 2+3*4
     * add -> mul | mul + add
     * mul -> num | num * mul
    */
    let ASTreeNode = new ASTNode("Program", "根元素"); //创建跟节点
    let child = add(tokenReader); //2
    if (child) {
        ASTreeNode.appendChildren(child);
    }
    console.log(JSON.stringify(ASTreeNode, null, 2));

    /**
     * 4.开始计算遍历语法树，推算结果
    */
    let result = caculAstResult(ASTreeNode);
    console.log('result = ', result);



}


function caculAstResult(ast) {
    let result = 0;
    switch (ast.type) {
        case "Program":
            for (let child of ast.children) {
                result = caculAstResult(child);
            }
            break;
        case "PLUS":
            result = caculAstResult(ast.children[0]) + caculAstResult(ast.children[1]);
            break;
        case "SUBMINUS":
            result = caculAstResult(ast.children[0]) - caculAstResult(ast.children[1]);
            break;
        case "MULTIPLY":
            result = caculAstResult(ast.children[0]) * caculAstResult(ast.children[1]);
            break;
        case "DIVIDER":
            result = caculAstResult(ast.children[0]) / caculAstResult(ast.children[1]);
            break;
        case "NUMBER":
            result = parseFloat(ast.value);
            break;
    }
    //console.log('result = ',result);
    return result;

}


function add(tokenReader) {
    let child1 = mul(tokenReader);  // 
    let node = child1;
    let token = tokenReader.peek(); //+?
    if (token && (token.type === "PLUS" || token.type === "SUBMINUS")) {
        token = tokenReader.read(); //+ 
        let child2 = add(tokenReader); //得到加法后面的节点,开始加法的递归
        node = new ASTNode(token.type, "加法");
        node.appendChildren(child1);  //加法左边的
        node.appendChildren(child2); //加法右边的
    }
    return node;
}



function mul(tokenReader) {
    let child1 = num(tokenReader);
    let node = child1;
    let token = tokenReader.peek(); //*?
    if (token != null && (token.type === 'MULTIPLY' || token.type === 'DIVIDER')) {
        token = tokenReader.read(); //*
        let child2 = mul(tokenReader);//开始递归
        if (child2 != null) {
            node = new ASTNode(token.type, token.type=='MULTIPLY'?"乘法":"除法");
            node.appendChildren(child1);
            node.appendChildren(child2);
        }
    }
    return node;
}


function num(tokenReader) {
    let node = null;
    let token = tokenReader.peek(); //先判断这个token是否是空的 
    if (token != null && token.type === 'NUMBER') {
        token = tokenReader.read(); //2 ，3
        node = new ASTNode(token.type, token.value);
    }
    return node;
}



parser(sourceCode);

module.exports = parser;