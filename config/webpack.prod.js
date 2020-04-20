const webpack = require("webpack");
const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const rootFolder = path.resolve(__dirname, "..");
const SrcFolder = rootFolder + "/src";
const SrcAssets = SrcFolder + "/assets";
const distFolder = rootFolder + "/dist";
const distAssetFolder = distFolder + "/assets";

module.exports = {
  entry: {
    vendor: rootFolder + "/index.js",
  },
  mode: "production",
  optimization: {
    minimize: true,
    // js and css minimizer
    minimizer: [new TerserJSPlugin({ extractComments: false,parallel: true}), new OptimizeCSSAssetsPlugin({})],
  },
  module: {
    rules: [
      // Add Babel loader
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        resolve: {
          extensions: [".js", ".jsx"],
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
      //   html loader
      {
        test: /\.html$/i,
        loader: "html-loader",
      },

      {
        test: /\.(gif|png|jpe?g)$/,
        include: [path.resolve(__dirname, "node_modules"), rootFolder],
        use: [
          {
            loader: "file-loader",
            options: {
              // prevent name become hash
              name: "[name].[ext]",
              // move files
              outputPath: (url, resourcePath) => {
                // look for node_modules plugin
                const matched = slash(resourcePath).match(
                  /node_modules\/(.*?)\//
                );
                if (matched) {
                  for (let i = 0; i < filesConfig.length; i++) {
                    if (filesConfig[i].filename.match(new RegExp(matched[1]))) {
                      let output = "";
                      filesConfig[i].params.forEach((param) => {
                        // get output path without filename
                        if (param.tag === "output") {
                          output = pathWithoutFile(param.name);
                        }
                      });
                      nodeMedia[url] = output + "/images/" + url;
                      return output + "/images/" + url;
                    }
                  }
                }
                // the rest of images put in media/misc/
                return "media/misc/" + url;
              },
              // rewrite path in css
              publicPath: (url, resourcePath) => {
                if (imageReference[url]) {
                  // fix image rewrite path
                  const filePath = pathWithoutFile(imageReference[url]);
                  return slash(
                    path.relative(
                      distAssetFolder + "/" + filePath,
                      distAssetFolder + "/media"
                    ) +
                      "/" +
                      url
                  );
                }
                if (nodeMedia[url]) {
                  return "images/" + url;
                }
                return "../../media/misc/" + url;
              },
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
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: SrcFolder + "/index.html",
    }),
    // create css file
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
    }),
  ],

  output: {
    filename: "[name].bundle.[contenthash].js",
    path: distFolder,
  },
  
};
