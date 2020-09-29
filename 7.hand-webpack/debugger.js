const webpack = require("webpack"); //引入官方的webpack

const myWebpack = require('./myWebapck'); //引入自己写的webpack

const webpackOptions = require("./webpack.config");
const compiler = webpack(webpackOptions);
compiler.run((err, stats) => {
  console.log(err);
  console.log(
    stats.toJson({
      entries: true,
      chunks: true,
      modules: true,
      _modules: true,
      assets: true,
    })
  );
});
