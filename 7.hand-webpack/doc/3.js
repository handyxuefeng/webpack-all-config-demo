let str = `webpackChunkName: 'title'`;
let reg = /webpackChunkName:\s*(['"])([^'"]+)\1/;
console.log(str.match(reg)[2])