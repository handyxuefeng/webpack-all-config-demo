function loader(source){
   console.log("pre-loader2");
   return source + "//pre-loader2";
}


loader.pitch = function() {
   console.log('pre-loader2-pitch2');
}

loader.normal = function() {
   console.log('pre-loader2-normal2');
}

module.exports = loader;