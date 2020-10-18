const tokenizer = require("./tokenizer"); //词法分析
const nodeTypes = require("./nodeTypes"); //生成AST语法树节点类型
let sourceCode = `<h1 id="title" name="ast" if='show' v-model="{{name}}"><span id="txtSpan">hello</span>world<i>123</i>789</h1>`;
//let sourceCode = `<h1 id="title"><span>hello</span>world</h1>`;
//let sourceCode1 = `<h1 id="title">world</h1>`;

function parser(sourceCode) {
  //1.对源码字符串进行词法分析，得到tokens数组
  let tokens = tokenizer(sourceCode);
  tokens.forEach((item, idx) => {
    item.idx = idx;
  }); //添加索引
  console.log("tokens= ", tokens);

  //2.对得到的tokens数组开始生成ast语法树
  let pos = 0; //tokens的起始位置

  let ast = {
    type: nodeTypes.Program,
    body: [
      {
        type: nodeTypes.ExpressionStatement,
        expression: walk(),
      },
    ],
  };

  /**
   * <h1 id="title"><span>hello</span>world</h1>
   * @param {*} parentNode
   */
  var rootNode={};
  function walk(parentNode) {
    let node, token, nextToken;
     if(!tokens[pos]) return node;
     token = tokens[pos]; //得到第一个
     nextToken = tokens[pos + 1];
    console.log("token = ", token, "nextToken=", nextToken);
    // <h1 id="title"><span>hello</span>world</h1>
    // <h1></h1>
     
    if (token.type === "LeftParentCheses" && nextToken.type === "JSXIdentifier") {
      console.log("token.value=", token.value);
      //一个JSXElement具有的如下几个属性
      node = {
        type: nodeTypes.JSXElement,
        openingElement: {
          type: nodeTypes.JSXOpeningElement,
          name: {
            type: nodeTypes.JSXIdentifier,
            name: tokens[pos + 1].value,
          },
          attributes: [],
        },
        children: [],
        closingElement: null,
      };
      if(!parentNode) {
        rootNode = node; //一开始保存最大的根节点
      }

      pos += 1; //1
      token = tokens[pos];
      //如果下一个分词不是 ">" 则开始读取元素的属性
      if (token.type !== "RightParentCheses") {
        pos++; //2
        token = tokens[pos];
        getAttributes(token);
      }

      //读取元素属性的方法<span>hello</span>
      function getAttributes(token) {
        if (token.type === "AttributeKey") {
          let valueIndex = pos + 2;

          //属性节点
          let JSXAttribute = {
            type: nodeTypes.JSXAttribute,
            name: {
              type: nodeTypes.JSXIdentifier,
              name: token.value,
            },
            value: {
              type: nodeTypes.Literal,
              value: tokens[valueIndex].value, //{ type: 'AttributeStringValue', value: '"title"' },
              raw: tokens[valueIndex].value,
            },
          };
          node.openingElement.attributes.push(JSXAttribute);
          pos = valueIndex + 1; // 5
          token = tokens[pos];
          getAttributes(token);
        }
        //表示已经把该标签的属性已经全部读取完毕了 , 开始读取孩子节点
        if (token.type === "RightParentCheses") {
          pos++; //5
          walk(node); //<span>hello</span>
        }
      }
      if (parentNode != null) {
        //h1.appendChild(span)
        parentNode.children.push(node);
        console.log("here----22222");
      } 
    }
    if (token.type === "LeftParentCheses" && nextToken.type === "BackSlash") {
        console.log('----',rootNode.openingElement.name.name);
    }
    if (token.type === "JSXText") {
      function getTextChild() {
        //读取元素的孩子节点
        let JSXTextNode = {
          type: token.type,
          value: token.value,
          raw: token.value,
        };
        if (parentNode) {
          parentNode.children.push(JSXTextNode); //添加文本节点元素
        } else {
          rootNode.children.push(JSXTextNode);
        }
        pos++;
        token = tokens[pos];
        nextToken = tokens[pos + 1];
        //表示当前标签已经读完，包括当前标签的孩子节点<span>hello</span>
        if (token.type === "LeftParentCheses" && nextToken.type === "BackSlash") {
          console.log("前端标签添加孩子节点完毕");
          pos = pos + 4;
          walk(rootNode);
        }
        else if(token.type === "LeftParentCheses" && nextToken.type === "JSXIdentifier"){
          //一个JSXElement具有的如下几个属性
        //   let subNode = {
        //     type: nodeTypes.JSXElement,
        //     openingElement: {
        //       type: nodeTypes.JSXOpeningElement,
        //       name: {
        //         type: nodeTypes.JSXIdentifier,
        //         name: tokens[pos + 1].value,
        //       },
        //       attributes: [],
        //     },
        //     children: [],
        //     closingElement: null,
        //   };
          //rootNode.children.push(subNode);
          walk(rootNode);
        }
        else{
            pos++;
            walk(rootNode);
        }
      }
      getTextChild();
    }

    return node;
  }
  console.log("ast = ", JSON.stringify(ast, null, 3));
}
parser(sourceCode);

/**
tokens=  [
  { type: 'LeftParentCheses', value: '<', idx: 0 },
  { type: 'JSXIdentifier', value: 'h1', idx: 1 },
  { type: 'AttributeKey', value: 'id', idx: 2 },
  { type: 'Equator', value: '=', idx: 3 },
  { type: 'AttributeStringValue', value: '"title"', idx: 4 },
  { type: 'RightParentCheses', value: '>', idx: 5 },
  { type: 'LeftParentCheses', value: '<', idx: 6 },
  { type: 'JSXIdentifier', value: 'span', idx: 7 },
  { type: 'RightParentCheses', value: '>', idx: 8 },
  { type: 'JSXText', value: 'hello', idx: 9 },
  { type: 'LeftParentCheses', value: '<', idx: 10 },
  { type: 'BackSlash', value: '/', idx: 11 },
  { type: 'JSXIdentifier', value: 'span', idx: 12 },
  { type: 'RightParentCheses', value: '>', idx: 13 },
  { type: 'JSXText', value: 'world', idx: 14 },
  { type: 'LeftParentCheses', value: '<', idx: 15 },
  { type: 'BackSlash', value: '/', idx: 16 },
  { type: 'JSXIdentifier', value: 'h1', idx: 17 },
  { type: 'RightParentCheses', value: '>', idx: 18 }
]
*/
exports.parser = module.exports = parser;
