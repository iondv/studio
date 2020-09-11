const webpack              = require('webpack');
const path                 = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER:  JSON.stringify(true),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }),
  new MiniCssExtractPlugin()
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new CleanWebpackPlugin({
      verbose: true,
      dry: false
    })
  );
}

module.exports = {
  entry: ['@babel/polyfill', './src/index.js'],
  resolve: {
    roots: [path.join(__dirname, 'src')],
    modules: ['node_modules'],
    extensions: ['.js', '.jsx']
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins,
  output: {
    path: `${__dirname}/public/assets/`,
    filename: 'bundle.js',
    publicPath: '/assets'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {loader: MiniCssExtractPlugin.loader},
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          {loader: MiniCssExtractPlugin.loader},
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.gif$/,
        use: 'url-loader?limit=10000&mimetype=image/gif'
      },
      {
        test: /\.jpg$/,
        use: 'url-loader?limit=10000&mimetype=image/jpg'
      },
      {
        test: /\.png$/,
        use: 'url-loader?limit=10000&mimetype=image/png'
      },
      {
        test: /\.svg/,
        use: 'url-loader?limit=26000&mimetype=image/svg+xml'
      },
      {
        test: /\.(woff|woff2|ttf|eot)/,
        use: 'url-loader?limit=1'
      },
      {
        test: /\.jsx?$/,
        use: 'babel-loader', exclude: [/node_modules/, /public/]
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  },
  devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,
  devServer: {
    headers: {'Access-Control-Allow-Origin': '*'}
  }
};