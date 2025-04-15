const path = require('path');

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node$/,
      loader: 'node-loader',
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false, // Disable unsupported module
      fs: false, // Disable file system module
    };

    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist': path.resolve(__dirname, 'node_modules/pdfjs-dist/legacy/build/pdf'),
    };

    return config;
  },
};
