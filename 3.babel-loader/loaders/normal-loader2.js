function loader(source){
   console.log("normal-loader1");
   return source + "//normal-loader2";
}

module.exports = loader;