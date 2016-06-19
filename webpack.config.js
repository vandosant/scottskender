const path = require('path')

module.exports = {
  context: __dirname,
  entry: {
    bundle: './client/app',
    bundlepost: './client/postEntry'
  },
  output: {
    path: path.join(__dirname, '/public'),
    filename: '[name].js',
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
	include: path.join(__dirname, '/client')
      }
    ]
  }
}
