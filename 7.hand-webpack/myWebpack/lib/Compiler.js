/**
 * webpack的编译类
 options = {
    mode:"development",
    devtool:false,
    entry:{
        main:'./src/index.js'
    },
    output:{
        filename:"bundle.js",
        path:path.resolve(__dirname,'dist')
    }
}
*/
const {Tapable,AsyncSeriesHook,SyncBailHook,AsyncParallelHook,SyncHook} = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory');
const Compilation = require('./Compilation');
class Compiler extends Tapable {
    constructor(context){
        super();
        this.context = context;
        console.log('1.传递给Compiler类的参数 =',context);
        this.hooks = {
            done: new AsyncSeriesHook(["stats"]),  //当webpack编译完成后，会触发这个钩子
            entryOption: new SyncBailHook(["context", "entry"]),

            thisCompilation: new SyncHook(["compilation", "params"]), //开始一次新的编译
            compilation: new SyncHook(["compilation", "params"]), //创建完成一个新的编译
           
            beforeRun: new AsyncSeriesHook(["compiler"]), //运行前钩子
            run: new AsyncSeriesHook(["compiler"]), 

            beforeCompile: new AsyncSeriesHook(["params"]), //编译前钩子
            compile: new SyncHook(["params"]), //编译钩子
            afterCompile: new AsyncSeriesHook(["compilation"]), //编译完成钩子

            make: new AsyncParallelHook(["compilation"]),

            failed: new SyncHook(["error"]),

        }
    }
    /**
     * 
     * @param {*} callback 
     * callback = (err, stats) => {
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
        }
     */
    run(callback){
        let stats = {
            entries: [], //显示所有的入口
            chunks: [], //显示所有的代码块
            modules: [], //显示所有模块
            assets: [],// 显示所有打包后的资源，也就是文件
        };
        console.log('2.webpack 开始编译');

        const finalCallback = (err, stats) => {
            callback(error,stats);
            /*
			this.running = false;
			if (err) {
				this.hooks.failed.call(err);
			}
            if (callback !== undefined) return callback(err, stats);
            */
        };
        const onCompiled = (error,compilation) =>{ 
            finalCallback(error,stats) ; //TODO
        }

        //1.先触发beforeRun的钩子
        this.hooks.beforeRun.callAsync(this,(error)=>{
            //2.触发run钩子
            this.hooks.run.callAsync(this, (err) =>{
                this.compile(onCompiled)
            }); 
        });
    }

    compile(onCompiled){
        const params = this.newCompilationParams();
        /**
         *  beforeCompile: new AsyncSeriesHook(["params"]), //编译前钩子
         *  1.通过callAsync方法触发beforeCompile 钩子
         */
        this.hooks.beforeCompile.callAsync(params, (err)=>{
            /**
             * compile: new SyncHook(["params"]), //编译钩子
             * 2.触发同步的complie钩子
             */
            this.hooks.compile.call(params); 
            const compilation = this.newCompilation(params);  // 创建一次新的编译

            /**
             *  make: new AsyncParallelHook(["compilation"]),
             *  3.触发compiler.make钩子
             */
            this.hooks.make.callAsync(compilation,err=>{
                onCompiled(error,compilation);
            });



        });

    }
    newCompilation(params){
        const compilation = new Compilation(this); // this = compiler

        /**
        *  thisCompilation: new SyncHook(["compilation", "params"]), //开始一次新的编译
        *  compilation: new SyncHook(["compilation", "params"]), //创建完成一个新的编译
        *  触发compiler上的下面两个钩子
        */
        this.hooks.thisCompilation.call(compilation, params);
		this.hooks.compilation.call(compilation, params);

        return compilation;



    }
    newCompilationParams(){
        let params = {
            normalModuleFactory: new NormalModuleFactory(),  //TODO 
        };
        return params;
    }

}
exports = module.exports = Compiler;