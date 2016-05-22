const path = require('path')

module.exports = {
  context: __dirname,
  entry: './js/app.js',
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  resolve: {
    extensions: ['', '.js']
  },
  stats: {
    colors: true,
    reasons: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
	loader: 'babel-loader',
	include: path.join(__dirname, '/js')
      }
    ]
  }
}
