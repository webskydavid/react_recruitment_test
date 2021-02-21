const devServerConfig = require('./config/webpack.server.config');

module.exports = {
  devServer: function (configFunction) {
    return (rest) => {
      const config = configFunction(rest);
      config.before = devServerConfig.before;
      return config;
    };
  },
};
