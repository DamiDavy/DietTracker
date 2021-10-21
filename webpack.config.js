const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
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
    extensions: ['.tsx', '.ts', '.js', '.jsx', 'scss'],
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
        test: /\.(png|jpe?g|svg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.jsx$/,
        exclude: /node-modules/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env"
          ]
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // {
      //   test: /\.tsx?$/,
      //   use: 'ts-loader',
      //   exclude: /node-modules/,
      //   loader: "babel-loader",
      //   options: {
      //     presets: [
      //       "@babel/preset-env", "@babel/preset-typescript"
      //     ]
      //   }
      // },
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
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     template: path.resolve('./index.html'),
  //   }),
  // ]
}