function loader(source){
   console.log("normal-loader1");
   return source + "//normal-loader2";
}
loader.pitch = function() {
   console.log('normal-loader2-pitch2');
}

loader.normal = function() {
   console.log('normal-loader2-normal2');
}

module.exports = loader;