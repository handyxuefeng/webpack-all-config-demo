let pic = require('./season.jpeg');
console.log(pic.default);
let img = new Image();
img.src = pic.default;
document.body.appendChild(img);
