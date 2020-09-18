function loader(source){
   console.log("post-loader2");
   return source + "//post-loader2";
}

loader.pitch = function() {
   console.log('post-loader2-pitch2');
}

loader.normal = function() {
   console.log('post-loader2-normal2');
}
module.exports = loader;