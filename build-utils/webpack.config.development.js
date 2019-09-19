const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = () => ({
  devServer: {
    clientLogLevel: "error", // The log level to show in the browser DevTools console.
    contentBase: false, // Where to serve public content from. This is only necessary if you want to serve static files.
    disableHostCheck: true, // Bypasses host checking.
    historyApiFallback: true, // Required for Reach Router.
    host: "0.0.0.0",
    hot: true, // Enable webpack's Hot Module Replacement feature.
    inline: true, // A script will be inserted in your bundle to take care of live reloading, and build messages will appear in the browser console.
    port: process.env.DOCKER_HOST_PORT,
    public: "localhost:" + process.env.DOCKER_HOST_PORT,
    stats: "minimal", // Control what is shown in the terminal output.
    writeToDisk: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
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
  plugins: [new CleanWebpackPlugin()]
});
