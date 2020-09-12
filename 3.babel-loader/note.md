## 利用谷歌写的complier.jar包对js文件生成对应sourcemap文件
- 1.先现在谷歌的complier.jar包 ：http://img.zhufengpeixun.cn/compiler.jar
- 2.在终端执行如下命令
- 3.进入到src目录下

```
java -jar compiler.jar --js script.js --create_source_map ./script-min.js.map --source_map_format=V3 --js_output_file script-min.js

```

##  通过http://murzwin.com/base64vlq.html 看生成后的编码位置
- 1.script-min.js.map文件
```
{
"version":3,
"file":"script-min.js",
"lineCount":1,
"mappings":"AAAA,IAAIA,EAAI,CAAR,CACIC,EAAI,CADR,CAEIC,EAAI;",
"sources":["script.js"],
"names":["a","b","c"]
}

```