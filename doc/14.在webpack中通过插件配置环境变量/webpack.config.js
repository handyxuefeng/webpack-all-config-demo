module.exports = {
  plugins: [
    //在webpack中定义环境变量，方便系统中每个业务逻辑，需要判断环境变量
    new webpack.DefinePlugin({
      DEV: JSON.stringify("production"),
      isMobile: true,
      expression: "10+20+30+40",  
    }),
  ],
};

// 在业务逻辑中，就可以直接读取这些环境变量
 console.log("DEV=", DEV, "isMobile = ", isMobile, "expression=", expression);

