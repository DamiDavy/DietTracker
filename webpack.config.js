const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: 'bundle.js'
    // filename: 'main.js',
    // path: path.resolve(__dirname, 'caloriecounter/frontend/static/frontend'),
  },
  devServer: {
    // publicPath: "/",
    // // contentBase: "./dist",
    // hot: true,
    static: {
      directory: './build'
    },
    compress: true,
    port: 9000,
  },
  resolve: {
    extensions: ['.jsx', '...'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ca]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.js$/,
        exclude: /node-modules/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env"
          ]
        }
      },
      {
        test: /\.ts$/,
        exclude: /node-modules/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env", "@babel/preset-typescript"
          ]
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node-modules/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env", "@babel/preset-react"
          ]
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('./index.html'),
    }),
  ]
}