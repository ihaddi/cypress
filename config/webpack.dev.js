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
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,

              // // use for separate css pages (custom pages, eg. wizard, invoices, etc.)
              // includePaths: demos.map((demo) => {
              //     return slash(srcPath) + "/sass/theme/demos/" + demo;
              // })
            },
          },
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
    // create css file
    new MiniCssExtractPlugin({
        filename: distAssetFolder + "/css/style.[name].css",
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
    port: 9000,
  },
};
