const NormalModule = require('./ NormalModule');

class NormalModuleFactory {
  constructor() {}
  /**
   * name = 'main'
   * entry  = './src/index.js'
   * context, = /Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack
   * resource = /Users/hanxf.han/project/webpack-all-config-demo/7.hand-webpack/src/index.js
   * @param {*} name
   * @param {*} entry
   * @param {*} context
   * @param {*} resource
   */
  create({ name, entry, context, resource, parser, async }) {
    let normalModule = new NormalModule({
      name,
      entry,
      context,
      resource,
      parser,
      async,
    });
    return normalModule;
  }
}

exports = module.exports = NormalModuleFactory;