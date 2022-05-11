const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: "production",
  entry: "/web/assets/frontend/firebase/main.js",
  //devtool: 'source-map',
  output: {
    // path: '/web/assets/frontend/js.es6/',
    // filename: "bundle.js",
    //publicPath: "/cache/assets/",
    library: "basefire",
    libraryTarget: "umd",
    sourceMapFilename: "[file].map"
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: false,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          output: {comments: false}
        }
      }),
    ],
  },
  module: {
    rules: [
      {
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
