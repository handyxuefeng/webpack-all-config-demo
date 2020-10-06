(function (modules) {
    function webpackJsonpCallback(data) {
      var chunkIds = data[0];
      var moreModules = data[1];
      var moduleId, chunkId, i = 0, resolves = [];
      for (; i < chunkIds.length; i++) {
        chunkId = chunkIds[i];
        if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
          resolves.push(installedChunks[chunkId][0]);
        }
        installedChunks[chunkId] = 0;
      }
      for (moduleId in moreModules) {
        if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
          modules[moduleId] = moreModules[moduleId];
        }
      }
      if (parentJsonpFunction) parentJsonpFunction(data);
      while (resolves.length) {
        resolves.shift()();
      }
    };
    var installedModules = {};
    var installedChunks = {
      "main": 0
    };
    function jsonpScriptSrc(chunkId) {
      return __webpack_require__.p + "" + ({ "sum": "sum", "title": "title" }[chunkId] || chunkId) + ".js"
    }
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
      }
      var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
      };
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      module.l = true;
      return module.exports;
    }
    __webpack_require__.e = function requireEnsure(chunkId) {
      var promises = [];
      var installedChunkData = installedChunks[chunkId];
      if (installedChunkData !== 0) {
        if (installedChunkData) {
          promises.push(installedChunkData[2]);
        } else {
          var promise = new Promise(function (resolve, reject) {
            installedChunkData = installedChunks[chunkId] = [resolve, reject];
          });
          promises.push(installedChunkData[2] = promise);
          var script = document.createElement('script');
          var onScriptComplete;
          script.charset = 'utf-8';
          script.timeout = 120;
          if (__webpack_require__.nc) {
            script.setAttribute("nonce", __webpack_require__.nc);
          }
          script.src = jsonpScriptSrc(chunkId);
          var error = new Error();
          onScriptComplete = function (event) {
            script.onerror = script.onload = null;
            clearTimeout(timeout);
            var chunk = installedChunks[chunkId];
            if (chunk !== 0) {
              if (chunk) {
                var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                var realSrc = event && event.target && event.target.src;
                error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
                error.name = 'ChunkLoadError';
                error.type = errorType;
                error.request = realSrc;
                chunk[1](error);
              }
              installedChunks[chunkId] = undefined;
            }
          };
          var timeout = setTimeout(function () {
            onScriptComplete({ type: 'timeout', target: script });
          }, 120000);
          script.onerror = script.onload = onScriptComplete;
          document.head.appendChild(script);
        }
      }
      return Promise.all(promises);
    };
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function (exports, name, getter) {
      if (!__webpack_require__.o(exports, name)) {
        Object.defineProperty(exports, name, { enumerable: true, get: getter });
      }
    };
    __webpack_require__.r = function (exports) {
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      }
      Object.defineProperty(exports, '__esModule', { value: true });
    };
    __webpack_require__.t = function (value, mode) {
      if (mode & 1) value = __webpack_require__(value);
      if (mode & 8) return value;
      if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
      var ns = Object.create(null);
      __webpack_require__.r(ns);
      Object.defineProperty(ns, 'default', { enumerable: true, value: value });
      if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
      return ns;
    };
    __webpack_require__.n = function (module) {
      var getter = module && module.__esModule ?
        function getDefault() { return module['default']; } :
        function getModuleExports() { return module; };
      __webpack_require__.d(getter, 'a', getter);
      return getter;
    };
    __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    __webpack_require__.p = "";
    __webpack_require__.oe = function (err) { console.error(err); throw err; };
    var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
    var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
    jsonpArray.push = webpackJsonpCallback;
    jsonpArray = jsonpArray.slice();
    for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
    var parentJsonpFunction = oldJsonpFunction;
    return __webpack_require__(__webpack_require__.s = "./src/index.js");
  })
    ({
        
            "./src/index.js":
            (function (module, exports, __webpack_require__) {
              let sync = __webpack_require__("./src/sync.js"); //同步导入代码方式
let test = __webpack_require__("./src/test.js"); //同步导入代码方式

__webpack_require__.e("title").then(__webpack_require__.t.bind(null, "./src/title.js", 7)).then(result => {
  console.log(result.default);
});

__webpack_require__.e("sum").then(__webpack_require__.t.bind(null, "./src/sum.js", 7)).then(result => {
  console.log(result.default);
});

__webpack_require__.e("operate").then(__webpack_require__.t.bind(null, "./src/operate.js", 7)).then(result => {
  console.log(result.default);
});

console.log("sync = ", sync, "test=", test);
            }),
        
            "./src/sync.js":
            (function (module, exports, __webpack_require__) {
              exports = module.exports = `Sync__${Date.now() * 1}`;
            }),
        
            "./src/test.js":
            (function (module, exports, __webpack_require__) {
              exports = module.exports = `test 文件__${Date.now() * 1}`;
            }),
         
    });