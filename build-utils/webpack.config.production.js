const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = mode => ({
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output.
      // Both options are optional.
      filename: `${mode}-output.css`,
      chunkFilename: "[id].css"
    })
  ]
});
