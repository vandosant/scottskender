const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')

module.exports = {
  context: __dirname,
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  stats: {
    colors: true,
    reasons: true
  },
  plugins: [
    new HTMLPlugin({
      template: './src/index.html'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
      	loader: 'babel-loader'
      }
    ]
  }
}
