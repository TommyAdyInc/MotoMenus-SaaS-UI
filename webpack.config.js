const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const modeConfig = env => require(`./build-utils/webpack.config.${env}`)(env);
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");

module.exports = ({ mode } = { mode: "prod" }) => {
  return webpackMerge(
    {
      entry: "./src/js/Entry.jsx",
      mode,
      module: {
        rules: [
          {
            enforce: "pre",
            exclude: /node_modules/,
            test: /\.(js|jsx)$/,
            use: ["eslint-loader"]
          },
          {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "style-loader"
              },
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1
                }
              },
              {
                loader: "postcss-loader",
                options: {
                  ident: "postcss",
                  plugins: [require("tailwindcss"), require("autoprefixer")]
                }
              }
            ]
          },
          {
            test: /\.jsx$/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env",
                  {
                    plugins: [
                      "@babel/plugin-proposal-class-properties",
                      "@babel/plugin-transform-runtime"
                    ]
                  },
                  "@babel/preset-react"
                ]
              }
            }
          },
          {
            test: /\.(gif|jpg|png|svg)$/i,
            use: [
              {
                loader: "url-loader",
                options: {
                  fallback: "file-loader",
                  limit: 8192
                }
              }
            ]
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: "html-loader"
                // options: { minimize: true }
              }
            ]
          }
        ]
      },
      optimization: {
        moduleIds: "hashed",
        runtimeChunk: "single",
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "node_modules",
              chunks: "all"
            }
          }
        }
      },
      output: {
        filename: `${mode}.[name].[hash].output.js`,
        publicPath: "/" // The public URL of the output directory when referenced in a browser. The URL to the output directory resolved relative to the HTML page (same directory).
      },
      plugins: [
        new Dotenv(),
        new HtmlWebpackPlugin({
          favicon: "./src/graphics/favicon.png",
          filename: "index.html",
          template: "./src/html/index-template.html",
          title: "888888888"
        }),
        new webpack.ProgressPlugin()
      ]
    },
    modeConfig(mode)
  );
};
