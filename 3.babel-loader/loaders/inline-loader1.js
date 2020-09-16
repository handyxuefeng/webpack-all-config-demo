function loader(source){
   console.log('inline-loader1');
   return source + "//inline-loader1";
}

loader.pitch = function() {
   console.log('inline-loader1-pitch1');
}

loader.normal = function() {
   console.log('inline-loader1-normal1');
}

module.exports = loader;