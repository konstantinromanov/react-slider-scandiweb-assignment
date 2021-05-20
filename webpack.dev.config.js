const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {        
    path: path.join(__dirname, "/dist"),    
    filename: "[name].[contenthash].js",
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
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      
      {
        test: /\.html$/,
        use: ["html-loader"],
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
  ],
  devServer: {
    publicPath: "/",
    contentBase: path.join(__dirname, "/"),
    historyApiFallback: true,
    port: 4000,
    open: true,
    hot: true
  }
};
