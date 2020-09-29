let obj = {
    jquery: {
        expose: "$",
        url: "https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.js"
    },
    lodash: {
        expose: "_",
        url: "https://cdn.bootcdn.net/ajax/libs/lodash.js/0.1.0/lodash.js"
    }
};
console.log(Object.values(obj),'=',Object.keys(obj));