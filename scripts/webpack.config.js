const path = require('path')

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: process.env.NODE_ENV,
  bail: process.env.NODE_ENV === 'production',
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',
  context: path.join(__dirname, '../'),
  entry: './src/index.ts',
  output: {
    filename: '[name].min.js',
    libraryExport: 'default',
    library: 'RabbitMock',
    libraryTarget: 'umd',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
    ],
  },
  devServer: {
    open: true,
    historyApiFallback: true,
    contentBase: path.join(__dirname, '../', './test/html'),
  },
  plugins: [],
  performance: {
    hints: false,
  },
}
