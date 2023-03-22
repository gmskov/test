const webpack = require("webpack");

module.exports = function override(config) {
  config.module.unknownContextCritical = false;
  config.resolve.fallback = Object.assign(config.resolve.fallback || {}, {
    ...config.resolve.fallback,
    fs: false,
    path: require.resolve("path-browserify"),
    buffer: require.resolve("buffer"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
    'process/browser': require.resolve('process/browser')
  });
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  return config;
};
