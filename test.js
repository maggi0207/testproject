const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',  // Entry file, change to .tsx for React with TypeScript
  output: {
    filename: 'bundle.js',  // Output file name
    path: path.resolve(__dirname, 'dist'),  // Output directory
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],  // Resolve .ts and .tsx extensions
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,  // Match .ts and .tsx files
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',  // Transpile TypeScript
        },
      },
      {
        test: /\.jsx?$/,  // For React JSX files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Transpile JSX to JS
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],  // Babel presets for React and modern JavaScript
          },
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
