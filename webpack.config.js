const _ = require("lodash");
const autoprefixer = require("autoprefixer");
const path = require("path");
const webpack = require("webpack");

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const PATHS = {
  entries: __dirname + '/src/js/views/',
  output: __dirname + '/dist/',
  jade: __dirname + '/src/jade/'
}

const sassLoaders = [
  "css-loader",
  "postcss-loader",
  "sass-loader?indentedSyntax=sass&includePaths[]=" + path.resolve(__dirname, "./style")
];

function jadePage(name) {
  return new HtmlWebpackPlugin({
    filename: name + '.html',
    template: PATHS.jade + name + '.jade',
    inject: false
  })
}

var SCRIPTS_ROOT = path.resolve(__dirname, "./scripts");
var STYLES_ROOT = path.resolve(__dirname, "./styles");

var SMELLY_PATH = path.resolve(__dirname, "./src/styles");

module.exports = {
  entry: {
    index: PATHS.entries + 'index.js', 
    form: PATHS.entries + 'form.js'
  },
  output: {
    path: PATHS.output,
    filename: 'js/[name].js'
  },
  module: {
    noParse: [
      /[\/]jquery[\/]/,
      /[\/]slideout[\/]/,
      /[\/]highcharts[\/]/
    ],
    preLoaders: [{
      test: /\.(es6|js|jsx)$/,
      loader: "eslint-loader", // to avoid confusion with `eslint` module
      include: _.merge([SCRIPTS_ROOT, STYLES_ROOT])
    }],
    eslint: {
      emitError: true,
      failOnError: true
    },
    loaders: [
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file",
        query: { name: "/fonts/[name].[ext]" },
      },{
        test: /\.png$/,
        loader: "file?name=[name].[ext]"
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("css-loader")
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", sassLoaders.join("!"))
      },
      {
        test: /\.(js|jsx|es6)$/,
        exclude: /(node_modules)/,
        loader: "babel",
        query: {
          presets: ["es2015"]
        }
      },
      { 
        test: /\.jade$/,
        exclude: /node_modules/,
        loader: 'jade' 
      }
    ]
  },
  resolve: {
    extensions: ["", ".js", ".es6", ".jsx"],
    modulesDirectories: ["node_modules"],
    alias: {
      "az-scripts": SCRIPTS_ROOT,
      "az-styles": SMELLY_PATH,
      "jquery$": "jquery/dist/jquery",
      "bootstrap$": "bootstrap/dist/js/bootstrap.min"
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      "window.jQuery": "jquery",
      $: "jquery",
      jQuery: "jquery"
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.bundle.js",
      minChunks: Infinity
    }),
    jadePage('index'),
    jadePage('form'),
    new ExtractTextPlugin('css/[name].css'),
    new CopyWebpackPlugin([
      { from: 'src/images', to: 'images' }
    ])
  ],
  postcss: function () {
    return [autoprefixer];
  }
}