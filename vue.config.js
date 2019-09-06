const webpack = require('webpack');

module.exports = {
  configureWebpack: () => ({
    plugins: [
      new webpack.DefinePlugin({
        GIT_COMMIT_HASH: JSON.stringify(
          require('child_process')
            .execSync('git rev-parse HEAD')
            .toString()
            .trim()
        ),
        PACKAGE_VERSION: JSON.stringify(require('./package').version),
        BUILT_AT: JSON.stringify(Date.now()),
      }),
    ],
  }),
};
