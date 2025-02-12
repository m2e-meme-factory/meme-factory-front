const path = require('path');

module.exports = function override(config, env) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@entities': path.resolve(__dirname, 'src/entities'),
    '@providers': path.resolve(__dirname, 'src/providers'),
    '@public': path.resolve(__dirname, 'public'),
    '@pages': path.resolve(__dirname, 'src/pages'),
    '@shared': path.resolve(__dirname, 'src/shared'),
    '@styles': path.resolve(__dirname, 'src/styles'),
    '@widgets': path.resolve(__dirname, 'src/widgets'),
  };

  return config;
};
