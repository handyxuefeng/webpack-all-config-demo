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
//<h1 id="title"><span>hello</span>world<i>123</i</h1>
//<h1>1</h1>
//<h1><i>1</i></h1>