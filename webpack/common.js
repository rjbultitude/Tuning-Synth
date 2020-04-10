const path = require('path');
const {prod_Path, src_Path} = require('./path');
const distDir = path.resolve(__dirname, prod_Path);
const copyPluginConfig = [
  { from: './audio', to: `${distDir}/audio` },
  { from: './favicon.ico', to: distDir }
];
const splitChunksConfig = {
  cacheGroups: {
    commons: {
      test: /[\\/]node_modules[\\/]/,
      name: 'vendor',
      chunks: 'all',
    },
    chunks: 'all'
  }
};

module.exports = {
  prod_Path,
  src_Path,
  distDir,
  copyPluginConfig,
  splitChunksConfig
}
