function loader(source){
   console.log("normal-loader1");
   return source + "//normal-loader1";
}

loader.pitch = function() {
   console.log('normal-loader1-pitch1');
}

loader.normal = function() {
   console.log('normal-loader1-normal1');
}

module.exports = loader;