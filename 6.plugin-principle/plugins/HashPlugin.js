/**
 * HashPlugin 插件
 * hash 每次编译都会产生一个hash值，整个项目文件只要有一个文件发生变化，hash值就会改变
 * chunkHash: 代码块hash，每个文件都有自己的hash值，每个文件的变化，只会影响该文件的代码块hash
 * contentHash: 内容hash，文件的内容发生变化，hash值才变化
 */

class HashPlugin {
    constructo(opts) {
        this.opts = opts;
        console.log('HashPlugin构造函数 = ', this.opts);
    }
    apply(compiler) {
        /**
        1.使用到了webpack/lib/compiler.js对象中的compilation钩子
         compiler.hooks = {
             compilation: new SyncHook(["compilation", "params"]),
         }
         2 使用到了webpack/lib/compilation.js对象中的 afterHash 钩子
           compilation.hooks = {
               afterHash: new SyncHook([]),
           }
        */
        compiler.hooks.compilation.tap("HashPlugin", (compilation) => {
            compilation.hooks.afterHash.tap("HashPlugin", () => {

                let chunks = compilation.chunks; //要去要打包的所有文件
                console.log('所有要打包的js文件 =',chunks);

                // webpack 把hash值放在了compilation.hash属性上
                //console.log('compilation.hash=',compilation.hash);

                //1.文件的hash，这样的话，所有要打包的文件的hash值都是同一个
                compilation.hash = `my_hash${Date.now() * 1}`; //修改文件的hash值

                //2.文件的chunkHash
                
                chunks = chunks.map(chunk => {
                    console.log('each chunk的renderHash = ', chunk.renderedHash);
                    return chunk.renderedHash = chunk.name + '_my_chunkHash'
                });

                //3. 设置每个要打包文件的contentHash
                for(let chunks of compilation.chunks) {
                    chunks.contentHash = {'javascript':'_my_contentHash'};
                }
                





            });
        });
    }
}

module.exports = HashPlugin;