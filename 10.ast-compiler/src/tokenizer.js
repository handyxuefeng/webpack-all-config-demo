
const LeftParentCheses = 'LeftParentCheses';  // '<'  左括号
const RightParentCheses = 'RightParentCheses';  // '>' 右括号
const BackSlash = 'BackSlash'; //  '/' 反斜杠
const JSXIdentifier = 'JSXIdentifier'; //标识符
const AttributeKey = 'AttributeKey'; //元素属性
const AttributeStringValue = 'AttributeStringValue'; //元素字符串值
const JSXText = 'JSXText'; //JSX文本
const Equator = 'Equator';

let sourceCode = `<h1 id="title" name="ast" if='show'><span>hello</span>world</h1>`;
//let sourceCode = `<template ><span>abc</span><div id="container" name="content">123</div>hello<i>world</i></template>`
//let sourceCode = `<t >1</t>`;

let currentToken = { type: '', value: '' };
let LettersNumberReg = /[a-zA-Z0-9]/;
let tokens = [];
function SaveToken() {
    if(currentToken.value.length>0){
        tokens.push(currentToken);
    }
    currentToken = { type: '', value: '' };
}

function Start(char) {
    if (char == '<') {
        currentToken = { type: LeftParentCheses, value: char };
        SaveToken();
        return foundLeftParentCheses;  //返回新的函数
    }
    throw new Error('第一个字符必须是<')
}

/**
 * 
 * @param {*} char 
 */
function foundLeftParentCheses(char) {
    //找到数字或者字母了
    if (LettersNumberReg.test(char)) {
        currentToken.type = JSXIdentifier;
        currentToken.value += char;
        return newJSXIdentifierFun;
    } else if (char === '/') {
        currentToken.type = BackSlash;
        currentToken.value += char;
        SaveToken();
        return newJSXIdentifierFun;
    }

}
function foundRightParentCheses(char) {
    if (char === "<") {
        currentToken.type = LeftParentCheses;
        currentToken.value += char;
        SaveToken();
        return foundLeftParentCheses;
    } else if (LettersNumberReg.test(char)) { //表示是纯文本孩子节点
        SaveToken();
        currentToken.type = JSXText;
        currentToken.value += char;
        return getJSXText;
    }
    throw new Error('找到有箭头的函数报错了');

}


function newJSXIdentifierFun(char) {
    //找到数字或者字母了
    if (LettersNumberReg.test(char)) {
        currentToken.type = JSXIdentifier;
        currentToken.value += char;
        return newJSXIdentifierFun;
    }
    else if (char === ' ') { //收集标识符的过程中遇到空格,则把前面收集到的分词保存起来
        SaveToken();
        return getAttributeFun;
    }
    else if (char === ">") {
        SaveToken();
        currentToken.type = RightParentCheses;
        currentToken.value += char;
        SaveToken();
        return foundRightParentCheses;
    }
    throw new Error('newJSXIdentifierFun函数报错了');
}

//读取属性的key <h1 id="title" name="ast"><span>
function getAttributeFun(char) {
    if (LettersNumberReg.test(char)) {
        currentToken.type = AttributeKey; //属性名
        currentToken.value += char;
        return getAttributeFun;
    }
    else if (char === '=') {
        SaveToken(); //把前面的分词保存起来
        currentToken.type = Equator;
        currentToken.value = char;
        SaveToken();
        return getAttributeValueFun;
    }
    else if(char==='>'){
        SaveToken();
        currentToken.type = RightParentCheses;
        currentToken.value += char;
        SaveToken();
        return foundRightParentCheses;
    }
    throw new Error('getAttributeFun获取属性的key或者属性的值出错')
}

//读取属性的值 id = "title"
function getAttributeValueFun(char) {
    if (char === '"' || char==="'") {  //属性的key已经结束
        currentToken.type = AttributeStringValue;
        currentToken.value += char;
        return getAttributeValueFun;
    } else if (char === ' ') { //表示结束了读某一个属性 value 
        SaveToken();
        return getAttributeFun;
    }
    else if (char === '>') {  //表示元素的 <h1 id="title">
        SaveToken();
        currentToken.type = RightParentCheses;
        currentToken.value += char;
        SaveToken();
        return foundRightParentCheses;
    }
    else if(LettersNumberReg.test(char)){
        currentToken.type = AttributeStringValue;
        currentToken.value += char;
        return getAttributeValueFun;
    }

    throw new Error(`getAttributeValueFun报错了,${tokens},char = ${char}`)




}



function getJSXText(char) {
    if (LettersNumberReg.test(char)) { //表示是纯文本孩子节点
        currentToken.type = JSXText;
        currentToken.value += char;
        return getJSXText;
    }
    else if (char === '<') {
        SaveToken();
        currentToken.type = LeftParentCheses;
        currentToken.value += char;
        SaveToken();
        return foundLeftParentCheses;
    }
    throw new Error('getJSXText报错了')
}





function tokenizer(SouceCode) {
    let currentStateFun = Start;  //刚开始的函数
    //循环迭代字符串
    for (let char of SouceCode) {
        let nextStateFun = currentStateFun(char);  //分析当期字符，并返回一个新的或者下一个新的状态的函数
       // console.log(`下一个状态的函数名称为:${nextStateFun.name}`, '_', Date.now() * 1);
        currentStateFun = nextStateFun;
    }
    if(currentToken.value.length>0){
        SaveToken();
    }
    return tokens;
}

let result = tokenizer(sourceCode);
console.log(`词法分析结果为:result=`, result);


exports.tokenizer = module.exports = {
    tokenizer
};

/**
 *  { type: 'LeftParentCheses', value: '<' },
    { type: 'JSXIdentifier', value: 'h1' },
    { type: 'JSXIdentifier', value: 'id' },
    { type: 'Equator', value: '=' },
    { type: 'AttributeStringValue', value: '"title"' },
    { type: 'RightParentCheses', value: '>' },
    { type: 'LeftParentCheses', value: '<' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'RightParentCheses', value: '>' },
    { type: 'JSXText', value: 'hello' },
    { type: 'LeftParentCheses', value: '<' },
    { type: 'BackSlash', value: '/' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'RightParentCheses', value: '>' },
    { type: 'JSXText', value: 'world' },
    { type: 'LeftParentCheses', value: '<' },
    { type: 'BackSlash', value: '/' },
    { type: 'JSXIdentifier', value: 'h1' },
    { type: 'RightParentCheses', value: '>' }
 */