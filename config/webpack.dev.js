const webpack = require("webpack");
const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const rootFolder = path.resolve(__dirname, "..");
const SrcFolder = rootFolder + "/src";
const SrcAssets = SrcFolder + "/assets";
const distFolder = rootFolder + "/dist";
const distAssetFolder = distFolder + "/assets";

module.exports = {
  entry: {
    vendor: rootFolder + "/index.js",
  },
  mode: "development",
  module: {
      
    rules: [
      // Add Babel loader
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        resolve: {
            extensions: [".js", ".jsx"]
          },
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      
        
      {
        test: /\.scss$/,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },

      //Images Loader
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
        options: {
          outputPath: "images",
          publicPath: "assets",
        },
      },
      //   html loader
      {
        test: /\.html$/i,
        loader: "html-loader",
      },

     
    ],
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: SrcFolder + "/index.html",
    }),
   
  ],

  output: {
    filename: "bundle.js",
    path: distFolder,
  },
  devServer: {
    contentBase: distFolder,
    compress: true,
    hot: true,
    open:true,
    port: 9000,
  },
};
