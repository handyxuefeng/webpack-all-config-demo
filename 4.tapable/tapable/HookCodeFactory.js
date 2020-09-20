class SyncHookCodeFactory {
  setup(instance, options) {
    this.options = options;
    instance._x = options.taps.map((item) => item.fn);
  }
  getArgs() {
    return this.options.args.join(",");
  }
  header() {
    return `var _x = this._x;\n`;
  }
  content() {
    return this.options.taps
      .map(
        (item, idx) =>
          `
             var _fn${idx} = _x[${idx}];\n
             _fn${idx}(${this.getArgs()});
           `
      )
      .join("\n");
  }
  create(options) {
      //通过Function拼装函数
    let fun = new Function(this.getArgs(), this.header() + this.content());
    return fun;
  }
}


module.exports = SyncHookCodeFactory;