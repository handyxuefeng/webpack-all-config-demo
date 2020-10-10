/**
 * code= <h1 id="title"><span>hello</span>world</h1>
 * 对上面的源代码进行词法分析
*/



let NUMBER = /[0-9]/;
let str = `10+20`;
let tokens = [];
const Numeric = 'Numeric';
const Punctuator = 'Punctuator';
let currentToken;

//确定了一个新的token时，则保存起来
function Save(token){
    currentToken = {type:'',value:''};
    tokens.push(token);
}

/**
 * 开始状态函数
 * @param {*} char 
 * 返回的是下一个状态的函数 
 */
function start(char){
    if(NUMBER.test(char)) { //如果是一个数字的话
        currentToken = {type: Numeric ,value: char};
    } 
    //开始进入到新的状态，收集或者捕获数字状态
    return getNumberStateFn;
}

function getNumberStateFn(char){
    if(NUMBER.test(char)) {
        currentToken.value += char;
        return getNumberStateFn;
    }else if(char==="+"){
        Save(currentToken); //把之前的分词保存起来
        Save({type:Punctuator,value: char }); //遇到了符号，直接保存起来
        currentToken = {type:Numeric,value:''};
        return getNumberStateFn;
    }
}

function tokenizer(input) {
    //刚开始的时候，是start的状态
    let state = start;
    for(let char of input) {
        let nextState = state(char);
        console.log('nextState.name = ',nextState.name);
        state = nextState;
    }
    //循环结束后，保存最后一个分词
    if(currentToken.value.length>0){
        Save(currentToken);
    }
}

tokenizer(str);


console.log('tokens = ',tokens);
