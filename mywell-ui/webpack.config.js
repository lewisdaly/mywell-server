'use strict';

var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * Env
 */
console.log('ENV:\n  SERVER_URL:\t', process.env.SERVER_URL);
console.log('  VERSION_NUMBER:\t', process.env.VERSION_NUMBER);
console.log('  REACT_APP_GRAPHQL_ENDPOINT:\t', process.env.REACT_APP_GRAPHQL_ENDPOINT);
console.log('  WEBPACK_DEV:\t', process.env.WEBPACK_DEV);

console.log("__dirname: ", __dirname);


//Settings
//TODO: load from env variable
let enableSourceMaps = true;
let shouldMinify = true;
let isProduction = true;

if (process.env.WEBPACK_DEV === 'true') {
  enableSourceMaps = false;
  shouldMinify = false;
  isProduction = false;
}

var ENV = process.env.npm_lifecycle_event;

//Hardcoded for now - I don't like implicit settings like this.
var isTest = false;
var isProd = false;

module.exports = function makeWebpackConfig() {
  var config = {};

  config.entry = isTest ? void 0 : {
    app: './src/app/app.js'
  };

  config.output = {
    path: __dirname + '/www',
    // publicPath: `http://localhost:${process.env.PORT}/`,
    publicPath: '/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  };

  if (enableSourceMaps) {
    config.devtool = 'source-map';
  }

  config.module = {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|lib)/
      },
      {
        test: /\.css$/,
        loader: isTest ? 'null-loader' : ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            {loader: 'css-loader', query: {sourceMap: true}},
            {loader: 'postcss-loader'}
          ],
        })
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        // test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        loader: 'file-loader'
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  };

  config.resolve = {
      modules: [
        `${__dirname}/lib`,
        `${__dirname}/node_modules`,
      ],
      alias: {
        ionic: "ionic/js/ionic"
      }
  };

  if (isTest) {
    config.module.rules.push({
      enforce: 'pre',
      test: /\.js$/,
      exclude: [
        /node_modules/,
        /\.spec\.js$/
      ],
      loader: 'istanbul-instrumenter-loader',
      query: {
        esModules: true
      }
    })
  }



  config.plugins = [
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/i,
      options: {
        postcss: {
          plugins: [autoprefixer]
        }
      }
    }),
    //Env Variables
    new webpack.DefinePlugin({
      "SERVER_URL": `'${process.env.SERVER_URL}'`,
      "VERSION_NUMBER": `'${process.env.VERSION_NUMBER}'`,
      "REACT_APP_GRAPHQL_ENDPOINT": `'${process.env.REACT_APP_GRAPHQL_ENDPOINT}'`
    })
  ];

  if (isProduction) {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      })
    );
  }

  if (!isTest) {
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: './src/public/index.html',
        inject: 'body'
      }),
      new ExtractTextPlugin({filename: 'css/[name].css', disable: !isProd, allChunks: true})
    )
  }

  if (shouldMinify) {
    config.plugins.push(
      // new webpack.NoErrorsPlugin(),
      // new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: true,
        sourceMap: true,
        mangle: false
      }),
      new CopyWebpackPlugin([{
        from: __dirname + '/src/public'
      }])
    );
  }

  config.devServer = {
    contentBase: './src/public',
    stats: 'minimal',
    port: parseInt(process.env.PORT),
    host: '0.0.0.0'
  };

  config.watchOptions = {
    poll: 1000
  };

  return config;
}();
