//读取在webpack中配置的环境变量
/**
 * new webpack.DefinePlugin({
      DEV:JSON.stringify('production'),
      isMobile:true,
      expression:"10+20+30+40"
    })
 */

 console.log("DEV=", DEV, "isMobile = ", isMobile, "expression=", expression);