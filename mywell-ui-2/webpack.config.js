const path = require('path');

module.exports = {
  entry: {
    'index': './app/index'
  },
  output: {
    path: path.resolve(__dirname, 'www'),
    filename: '[name].js',
    chunkFilename : '[chunkhash].js'
  },
  module: {
    rules: [
      {
        test   : /\.css$/,
        loader : 'css-loader'
      },
      {
        test   : /\.html$/,
        loader : 'html-loader'
      },
      {
        test   : /\.json$/,
        loader : 'json-loader'
      },
      {
        test   : /\.scss$/,
        loader : 'style-loader!css-loader!sass-loader?outputStyle=expanded'
      },
      {
        test   : /\.woff/,
        loader : 'url-loader?prefix=font/&limit=10000&mimetype=application/font-woff'
      },
      {
        test   : /\.ttf/,
        loader : 'file-loader?prefix=font/'
      },
      {
        test   : /\.eot/,
        loader : 'file-loader?prefix=font/'
      },
      {
        test   : /\.svg/,
        loader : 'file-loader?prefix=font/'
      },
      {
        test   : /[\/]angular\.js$/,
        loader : 'exports-loader?angular'
      },
      {
        test   : /[\/]ionic\.js$/,
        loader : 'exports-loader?ionic'
      }
    ]
  },
  resolve: {
    modules: [
      'bower_components',
      'node_modules'
    ]
  }
  // resolve: {
  //   root: [
  //     path.join(__dirname, 'app'),
  //     path.join(__dirname, 'bower_components'),
  //     path.join(__dirname, 'node_modules'),
  //   ],
  //   moduleDirectories: [
  //     'bower_components',
  //     'node_modules',
  //   ],
  //   alias: {
  //   }
  // },

};
