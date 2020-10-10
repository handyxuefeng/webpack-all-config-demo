

## 对源代码进行词法分析
- 词法分析 接收原始代码,然后把它分割成一些被称为 token 的东西，这个过程是在词法分析器(Tokenizer或者Lexer)中完成的
- Token 是一个数组，由一些代码语句的碎片组成。它们可以是数字、标签、标点符号、运算符或者其它任何东西



## 对词法分析分析后的代码进行
- 语法分析 接收之前生成的 token，把它们转换成一种抽象的表示，这种抽象的表示描述了代码语句中的每一个片段以及它们之间的关系。这被称为中间表示(intermediate representation)或抽象语法树(Abstract Syntax Tree, 缩写为AST)
- 抽象语法树是一个嵌套程度很深的对象，用一种更容易处理的方式代表了代码本身，也能给我们更多信息

## AST抽象语法树的分析
```
yarn add esprima estraverse estraverse-fb -D
```