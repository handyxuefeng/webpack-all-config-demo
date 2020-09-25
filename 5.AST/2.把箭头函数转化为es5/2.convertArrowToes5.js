/**
 * 通过@babel/parse 
 * 1.安装 yarn add @babel/core babel-types @babel/plugin-transform-arrow-functions -D
 */
let babel = require('@babel/core');//把es6语法转换成AST语法
let t = require('babel-types'); //类型判断某个节点是否是某种类型，或者创建一个新的某种类型的节点
let code = `const sum = (a,b)=> a+b;`;
let arrowFunctionPlugin = require('@babel/plugin-transform-arrow-functions');
const { generate } = require('escodegen');

//官方的转换写法
/*
let converResult = babel.transform(code, {
    plugins: [arrowFunctionPlugin]
});
*/



// 手写es6转换es5的插件
let arrowFuntionToEs5Plugin =  {
    visitor:{
        ArrowFunctionExpression: (path) =>{
           // console.log('path = ',path);
            let node = path.node;  //当前路径上的节点
            let id = path.parent.id;  //父路径上的ID identifer sum
            let params = node.params;  //函数的参数

           //console.log('id = ',id,'params = ',params);
            /**
             * 通过babel/types 提供的方法，构建对应的对象
             * babel/types类库提供了如下方法
             * t.FunctionExpression, 
             * t.BlockStatement
             * t.ReturnStatement
            */
            let returnStatement = t.returnStatement(node.body);  //函数的返回语句
            let body = t.blockStatement([returnStatement]);
            let functionExpression =  t.functionExpression(id, params,body,node.generate,node.async);
           // console.log('functionExpression=',functionExpression);
            path.replaceWith(functionExpression);
        }
    }
}

let converResult = babel.transform(code, {
    plugins: [arrowFuntionToEs5Plugin]
});


console.log(converResult.code);
/**
 * {
  parent: Node {
    type: 'VariableDeclarator',
    start: 6,
    end: 23,
    loc: SourceLocation { start: [Position], end: [Position] },
    id: Node {
      type: 'Identifier',
      start: 6,
      end: 9,
      loc: [SourceLocation],
      name: 'sum',
      leadingComments: undefined,
      innerComments: undefined,
      trailingComments: undefined
    },
    init: Node {
      type: 'ArrowFunctionExpression',
      start: 12,
      end: 23,
      loc: [SourceLocation],
      id: null,
      generator: false,
      async: false,
      params: [Array],
      body: [Node],
      leadingComments: undefined,
      innerComments: undefined,
      trailingComments: undefined
    },
    leadingComments: undefined,
    innerComments: undefined,
    trailingComments: undefined
  },
  hub: {
    file: File {
      _map: Map {},
      declarations: {},
      path: [NodePath],
      ast: [Node],
      metadata: {},
      code: 'const sum = (a,b)=> a+b;',
      inputMap: null,
      hub: [Circular],
      opts: [Object],
      scope: [Scope]
    },
    getCode: [Function: getCode],
    getScope: [Function: getScope],
    addHelper: [Function: bound addHelper],
    buildError: [Function: bound buildCodeFrameError]
  },
  contexts: [
    TraversalContext {
      queue: [Array],
      parentPath: [NodePath],
      scope: [Scope],
      state: undefined,
      opts: [Object],
      priorityQueue: []
    }
  ],
  data: null,
  _traverseFlags: 0,
  state: undefined,
  opts: {
    ArrowFunctionExpression: { enter: [Array] },
    _exploded: {},
    _verified: {},
    BlockStatement: { exit: [Array] },
    Program: { exit: [Array] },
    TSModuleBlock: { exit: [Array] }
  },
  skipKeys: null,
  parentPath: NodePath {
    parent: Node {
      type: 'VariableDeclaration',
      start: 0,
      end: 24,
      loc: [SourceLocation],
      declarations: [Array],
      kind: 'const',
      leadingComments: undefined,
      innerComments: undefined,
      trailingComments: undefined
    },
    hub: {
      file: [File],
      getCode: [Function: getCode],
      getScope: [Function: getScope],
      addHelper: [Function: bound addHelper],
      buildError: [Function: bound buildCodeFrameError]
    },
    contexts: [ [TraversalContext] ],
    data: null,
    _traverseFlags: 0,
    state: undefined,
    opts: {
      ArrowFunctionExpression: [Object],
      _exploded: {},
      _verified: {},
      BlockStatement: [Object],
      Program: [Object],
      TSModuleBlock: [Object]
    },
    skipKeys: null,
    parentPath: NodePath {
      parent: [Node],
      hub: [Object],
      contexts: [Array],
      data: null,
      _traverseFlags: 0,
      state: undefined,
      opts: [Object],
      skipKeys: null,
      parentPath: [NodePath],
      context: [TraversalContext],
      container: [Array],
      listKey: 'body',
      key: 0,
      node: [Node],
      scope: [Scope],
      type: 'VariableDeclaration'
    },
    context: TraversalContext {
      queue: [Array],
      parentPath: [NodePath],
      scope: [Scope],
      state: undefined,
      opts: [Object],
      priorityQueue: []
    },
    container: [ [Node] ],
    listKey: 'declarations',
    key: 0,
    node: Node {
      type: 'VariableDeclarator',
      start: 6,
      end: 23,
      loc: [SourceLocation],
      id: [Node],
      init: [Node],
      leadingComments: undefined,
      innerComments: undefined,
      trailingComments: undefined
    },
    scope: Scope {
      uid: 0,
      block: [Node],
      path: [NodePath],
      labels: Map {},
      inited: true,
      references: [Object: null prototype],
      bindings: [Object: null prototype],
      globals: [Object: null prototype] {},
      uids: [Object: null prototype] {},
      data: [Object: null prototype] {},
      crawling: false
    },
    type: 'VariableDeclarator'
  },
  context: TraversalContext {
    queue: [ [Circular] ],
    parentPath: NodePath {
      parent: [Node],
      hub: [Object],
      contexts: [Array],
      data: null,
      _traverseFlags: 0,
      state: undefined,
      opts: [Object],
      skipKeys: null,
      parentPath: [NodePath],
      context: [TraversalContext],
      container: [Array],
      listKey: 'declarations',
      key: 0,
      node: [Node],
      scope: [Scope],
      type: 'VariableDeclarator'
    },
    scope: Scope {
      uid: 0,
      block: [Node],
      path: [NodePath],
      labels: Map {},
      inited: true,
      references: [Object: null prototype],
      bindings: [Object: null prototype],
      globals: [Object: null prototype] {},
      uids: [Object: null prototype] {},
      data: [Object: null prototype] {},
      crawling: false
    },
    state: undefined,
    opts: {
      ArrowFunctionExpression: [Object],
      _exploded: {},
      _verified: {},
      BlockStatement: [Object],
      Program: [Object],
      TSModuleBlock: [Object]
    },
    priorityQueue: []
  },
  container: Node {
    type: 'VariableDeclarator',
    start: 6,
    end: 23,
    loc: SourceLocation { start: [Position], end: [Position] },
    id: Node {
      type: 'Identifier',
      start: 6,
      end: 9,
      loc: [SourceLocation],
      name: 'sum',
      leadingComments: undefined,
      innerComments: undefined,
      trailingComments: undefined
    },
    init: Node {
      type: 'ArrowFunctionExpression',
      start: 12,
      end: 23,
      loc: [SourceLocation],
      id: null,
      generator: false,
      async: false,
      params: [Array],
      body: [Node],
      leadingComments: undefined,
      innerComments: undefined,
      trailingComments: undefined
    },
    leadingComments: undefined,
    innerComments: undefined,
    trailingComments: undefined
  },
  listKey: undefined,
  key: 'init',
  node: Node {
    type: 'ArrowFunctionExpression',
    start: 12,
    end: 23,
    loc: SourceLocation { start: [Position], end: [Position] },
    id: null,
    generator: false,
    async: false,
    params: [ [Node], [Node] ],
    body: Node {
      type: 'BinaryExpression',
      start: 20,
      end: 23,
      loc: [SourceLocation],
      left: [Node],
      operator: '+',
      right: [Node],
      leadingComments: undefined,
      innerComments: undefined,
      trailingComments: undefined
    },
    leadingComments: undefined,
    innerComments: undefined,
    trailingComments: undefined
  },
  scope: Scope {
    uid: 1,
    block: Node {
      type: 'ArrowFunctionExpression',
      start: 12,
      end: 23,
      loc: [SourceLocation],
      id: null,
      generator: false,
      async: false,
      params: [Array],
      body: [Node],
      leadingComments: undefined,
      innerComments: undefined,
      trailingComments: undefined
    },
    path: [Circular],
    labels: Map {},
    inited: true,
    references: [Object: null prototype] {},
    bindings: [Object: null prototype] { a: [Binding], b: [Binding] },
    globals: [Object: null prototype] {},
    uids: [Object: null prototype] {},
    data: [Object: null prototype] {}
  },
  type: 'ArrowFunctionExpression'
}
 */

