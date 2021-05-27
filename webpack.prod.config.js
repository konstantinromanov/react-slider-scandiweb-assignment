const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    mode: "production",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      assetModuleFilename: 'images/[name][hash][ext][query]',
      filename: "[name].[contenthash].js",
    },
    optimization: {
      minimize: true,
      minimizer: [
        `...`,
        new CssMinimizerPlugin(),
      ],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },        
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"]
        },        
        {
          test: /\.(svg|png|jpg|gif)$/,
          type: "asset/resource"
        },         
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",        
      }), 
      new CleanWebpackPlugin(),      
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
    ],
  };
  