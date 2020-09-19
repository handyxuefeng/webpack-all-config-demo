

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
