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
    extensions: ['', '.js', '.jsx']
  },
  stats: {
    colors: true,
    reasons: true
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
	loader: 'babel-loader',
	include: path.join(__dirname, '/js')
      }
    ]
  }
}
