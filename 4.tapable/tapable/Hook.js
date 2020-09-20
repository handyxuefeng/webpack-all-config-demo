class Hook {
  constructor(args) {
    if (!Array.isArray(args)) args = [];
    this._args = args; //放参数列表
    this.taps = []; //用来放在钩子上注册的函数，存的是对象 [{name:'钩子名称',fn:钩子函数}]
    this._x = undefined; //也是用来存放注册的钩子函数
    this.hookName = args;
    //this.call = this._call;
  }
  //hook.tap("name",fn)
  tap(options, fn) {
    if (typeof options === "string") {
      options = { name: options };
    }
    options.fn = fn;
    this._insert(options);
  }
  /**
     options = {
       name:"钩子函数名称",
       fn:fn
     }
     * @param {*} options 
     */
  _insert(options) {
    this.taps.push(options);
  }
  /**
   *
   * @param  {...any} args = ["param1","param2"]
   */
  call(...args) {
    let callMethod = this._createCall(); //动态编译出一个函数
    console.log("callMethod=", callMethod.toString());
    return callMethod.apply(this, args);
  }
  _createCall(){
      return this.complie({
         taps:this.taps , //taps = [{"name":"syncHook",fn:fn}]
         args:this._args   //参数数组
      });
  }
}

module.exports = Hook;