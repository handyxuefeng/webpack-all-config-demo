/**
 * 自动引入外部脚本，并挂载在window对象上
   1. 当引入 lodash， jquery模块的时候，自动转为外部模块，不再打包次模块到chunk上，读的是window 上 jquery 和 _ 变量
   2. 自动向产出的html里面插入script标签，标签src 指向库的cdn 的url地址
   3. 在业务代码中，只要require('')那个模块，就把对应模块动态插入到html文件中，而不是所有的配置cdn都插入到html中

 * opts = {
      //key 是模块的名称，值是一个对象expose，次cdn脚本向window挂的变量名，url 是 CDN提供的
      jquery:{
         expose:"$",
         url:"https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.js"
      },
      lodash:{
         expose:"_",
         url:"https://cdn.bootcdn.net/ajax/libs/lodash.js/0.1.0/lodash.js"
      }
    }
 */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExternalModule = require('webpack/lib/ExternalModule');

class AutoExternalPlugin {
    constructor(opts) {
        this.opts = opts;
        this.usedExternalModules = new Set();
        console.log('this.opts = ', this.opts);
    }
    //webpack调用插件的入口方法，webpack会传递compiler对象过来
    apply(compiler) {
        let _this = this;
        let { opts, usedExternalModules } = this;

        //自动向html中插入script标签
        /*
        使用到了compiler对象中的compilation和normalModuleFactory 钩子
         compiler.hooks = {
             compilation: new SyncHook(["compilation", "params"]),
             normalModuleFactory: new SyncHook(["normalModuleFactory"]),
         }
         webpack module normalModule 普通模块，普通的js模块
         普通模块normal module 是由normalModuleFactory创建，
         普通模块的创建顺序
         NormalModuleFactory----->normalModule
         现在要把普通模块变成一个外部模块
        */
        //实现第二部分：当引入 lodash， jquery模块的时候，自动转为外部模块，不再打包次模块到chunk上，读的是window 上 jquery 和 _ 变量
        compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin', (normalModuleFactory) => {
            /**
               normalModuleFactory.hooks = {
                  factory: new SyncWaterfallHook(["factory"])
                  parser: new HookMap(() => new SyncHook(["parser", "parserOptions"])),
               }
            */

            normalModuleFactory.hooks.parser.for('javascript/auto').tap('AutoExternalPlugin', (parser) => {

                //业务代码中，通过import形式导入的代码  import _ from 'lodash';
                parser.hooks.import.tap('AutoExternalPlugin', (statement, source) => {
                    if (opts[source]) {
                        usedExternalModules.add(source);//把Source模块添加到Set中，不允许重复 let $ = require('jquery')
                    }
                });


                //业务代码中，通过require形式导入的代码let $ = require('jquery');
                parser.hooks.call.for('require').tap('AutoExternalPlugin', (expression) => {
                    let value = expression.arguments[0].value;
                    if (opts[value]) {
                        usedExternalModules.add(value);//把Source模块添加到Set中，不允许重复 let $ = require('jquery')
                    }
                });


            });



            normalModuleFactory.hooks.factory.tap('AutoExternalPlugin', (factory) => (data, callback) => {

                let request = data.request;
                if (opts[request]) { //jquery
                    let { expose } = opts[request];
                    //创建一个外部模块返回就可以了 $ window request
                    callback(null, new ExternalModule(expose, 'window', request));
                } else {
                    factory(data, callback);
                }

            });


        });





        //2. 自动向产出的html里面插入script标签，标签src 指向库的cdn 的url地址
        compiler.hooks.compilation.tap("AutoExternalPlugin", (compilation) => {
            //HtmlWebpackPlugin 可以向compilation 增加额外的钩子,供其他插件来调用
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('AutoExternalPlugin', (HtmlWebpackPluginData, callback) => {
                //console.log('HtmlWebpackPluginData=',HtmlWebpackPluginData);
                let scriptTagFromAssetTags = HtmlWebpackPluginData.assetTags.scripts;
                //console.log('scriptTagFromAssetTags=',scriptTagFromAssetTags);
                //let insertScripts = optsArray.map(item => item.url);
                let insertScripts = [];
                for(let key in this.opts) {
                    if(usedExternalModules.has(key)){
                        insertScripts.push(this.opts[key].url);
                    }
                }

                console.log('usedExternalModules = ',usedExternalModules ,'insertScripts=',insertScripts);


                //向HtmlWebpackPlugin 的assetTags 对象scripts 对象中插入要插入的对象,从而完成在html中插入在webpack.config.js中配置的要插入的外链脚本
                insertScripts.forEach(url => {
                    scriptTagFromAssetTags.unshift({
                        tagName: 'script',
                        voidTag: false,
                        attributes: { defer: false, src: url }
                    })
                });

                callback(null);

            });
        })







    }
}

module.exports = AutoExternalPlugin;