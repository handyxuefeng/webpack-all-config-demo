function loader(source){
   console.log('post-loader1');
   return source + "//post-loader1";
}

loader.pitch = function() {
   console.log('post-loader1-pitch1');
}

loader.normal = function() {
   console.log('post-loader1-normal1');
}

module.exports = loader;