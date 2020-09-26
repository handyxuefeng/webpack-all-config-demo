class AssetPlugin {
    constructor(opts){
        console.log("资产插件的参数:", opts);
    }
    apply(complier){
      /**
        Compiler  类
        complier.hooks = {
            compilation: new SyncHook(["compilation", "params"]),
        }
        Compilation 类
        compilation.hooks = {
            chunkAsset: new SyncHook(["chunk", "filename"]),
        }
        */
      complier.hooks.compilation.tap("AssetsPlugin",(compilation, params) => {

        compilation.hooks.chunkAsset.tap("AssetsPlugin",(chunk,filename)=>{
            console.log('chunk=',chunk);
            console.log('filename=',filename);
            console.log(compilation.assets);
        });

      });
    }
}

module.exports = AssetPlugin;