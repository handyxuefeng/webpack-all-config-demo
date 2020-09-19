function loader(source) {
  let callback = this.async();
   callback(null, source + "//async2");
}

module.exports = loader;