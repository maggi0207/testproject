const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',  // Your entry file
  output: {
    filename: 'bundle.js',  // Output file name
    path: path.resolve(__dirname, 'dist'),  // Output directory
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Transpiles JavaScript using Babel
        },
      },
      {
        test: /\.jsx$/,  // For React JSX files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Transpiles JSX to JS
        },
      },
    ],
  },
  devServer: {
    proxy: {
      '/mysshome': {
        target: 'http://myssc-dev-services.statestr.com:81',  // Backend API URL
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/mysshome': '',  // Remove '/mysshome' before proxying
        },
        onProxyReq: (proxyReq, req, res) => {
          // Add custom headers or other configurations as needed
          proxyReq.setHeader('Access-Control-Allow-Origin', '*');
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('sm_user', 'p871422');
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',  // Path to your HTML file
    }),
  ],
};
