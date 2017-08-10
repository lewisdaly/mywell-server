const path = require('path');
const webpack = require('webpack');

module.exports = {
  devServer: {
    compress: false,
    port: 8080
  },
  entry: {
    'index': './app/index'
  },
  output: {
    path: path.resolve(__dirname, 'www'),
    filename: '[name].js',
    chunkFilename : '[chunkhash].js',
    publicPath:'/'
  },
  module: {
    rules: [
      {
       test: /\.js$/,
       exclude: /node_modules/,
       loader: "babel-loader"
      },
      {
        test   : /\.css$/,
        loader : 'css-loader?sourceMap&context=/'
      },
      {
        test   : /\.html$/,
        loader : 'raw-loader'
      },
      {
        test   : /\.json$/,
        loader : 'json-loader'
      },
      {
        test   : /\.scss$/,
        use: [
          'style-loader',
          'css-loader?sourceMap&context=/',
          'sass-loader'
        ]
      },
      {
        // ASSET LOADER
        // Reference: https://github.com/webpack/file-loader
        // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
        // Rename the file using the asset hash
        // Pass along the updated reference to your code
        // You can add here any file extension you want to get copied to your output
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'file-loader'
      },
      // {
      //   test   : /[\/]angular\.js$/,
      //   loader : 'exports-loader?angular'
      // },
      // {
      //   test   : /[\/]ionic\.js$/,
      //   loader : 'exports-loader?ionic'
      // }
    ]
  },
  resolve: {
    modules: [
      'bower_components',
      'node_modules'
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        sassLoader: {
          includePaths: [path.resolve(__dirname, 'src', 'scss')]
        },
        context: '/'
      }
    })
  ]
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
