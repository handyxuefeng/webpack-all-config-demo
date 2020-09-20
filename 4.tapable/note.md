## tapable 是webpack中核心类，包含如下方法
- SyncHook: [Function: SyncHook],
- SyncBailHook: [Function: SyncBailHook],
- SyncWaterfallHook: [Function: SyncWaterfallHook],
- SyncLoopHook: [Function: SyncLoopHook],
- AsyncParallelHook: [Function: AsyncParallelHook],
- AsyncParallelBailHook: [Function: AsyncParallelBailHook],
- AsyncSeriesHook: [Function: AsyncSeriesHook],
- AsyncSeriesBailHook: [Function: AsyncSeriesBailHook],
- AsyncSeriesWaterfallHook: [Function: AsyncSeriesWaterfallHook],
```

let tapable = require('tapable');
console.log(tapable);
{
  __esModule: true,
  Tapable: [Function: Tapable] { addCompatLayer: [Function: addCompatLayer] },
  SyncHook: [Function: SyncHook],
  SyncBailHook: [Function: SyncBailHook],
  SyncWaterfallHook: [Function: SyncWaterfallHook],
  SyncLoopHook: [Function: SyncLoopHook],
  AsyncParallelHook: [Function: AsyncParallelHook],
  AsyncParallelBailHook: [Function: AsyncParallelBailHook],
  AsyncSeriesHook: [Function: AsyncSeriesHook],
  AsyncSeriesBailHook: [Function: AsyncSeriesBailHook],
  AsyncSeriesWaterfallHook: [Function: AsyncSeriesWaterfallHook],
  HookMap: [Function: HookMap],
  MultiHook: [Function: MultiHook]
}
```