const path = require('path');
const fs = require('fs');
module.exports = {
  entry: {
    main: "./src/index.js",
  },
  mode: "development",
  output: {
    filename: "tree-shaking.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              //["import",{libraryName:'lodash'}]
              [path.resolve(__dirname,"plugins/babel-plugin-import.js"), { libraries:['lodash']}],
            ],
          },
        },
      },
    ],
  },
};
