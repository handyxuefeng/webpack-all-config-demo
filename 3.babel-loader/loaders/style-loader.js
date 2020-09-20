let loaderUtils = require("loader-utils");
function loader(source) {

}
loader.pitch = function (remainingRequest, previousRequest, data) {
  //console.log("previousRequest", previousRequest); //之前的路径
  //console.log('currentRequest', currentRequest);//当前的路径
  //console.log("remainingRequest", remainingRequest); //剩下的路径
  //console.log("data", data);
  // !! noPrePostAutoLoaders 不要前后置和普通loader
  //__webpack_require__(/*! !../loaders/less-loader.js!./index.less */ "./loaders/less-loader.js!./src/index.less");
  let style = `
    var style = document.createElement("style");
    style.innerHTML = require(${loaderUtils.stringifyRequest(this,"!!" + remainingRequest)});
    document.head.appendChild(style);
 `;
  return style;
};
module.exports = loader;



/*

function styleLoader(source) {
  console.log("自定义的style-loader，传进来的值为:source = ", source);
  
  let styleScript = `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
    module.exports = '';
  `;
  return styleScript;

}

styleLoader.pitch = function () {};

module.exports = styleLoader;
*/
