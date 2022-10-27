const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    bundle: './src/entries/index.ts',
    invoice: './src/entries/invoice.ts'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/pages', to: '.' },
        { from: './src/styles', to: './styles' },
        { from: './src/fonts', to: './fonts' }
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    clean: true,
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
};
