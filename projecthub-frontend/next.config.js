// next.config.js
// const path = require('path');

// module.exports = {
//     webpack: (config) => {
//       config.resolve.alias = {
//         ...config.resolve.alias,
//         'pdfjs-dist': path.resolve(__dirname, 'node_modules/pdfjs-dist/legacy/build/pdf'),
//       };
//       config.resolve.fallback = {
//         canvas: false,
//         fs: false,
//       };
//       return config;
//     },
//   };


// next.config.js
const path = require('path');

module.exports = {
  webpack: (config) => {
    // Disable unnecessary worker files
    config.plugins = config.plugins.filter((plugin) => {
      return plugin.constructor.name !== 'ReactRefreshWebpackPlugin';
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist': path.resolve(__dirname, 'node_modules/pdfjs-dist/legacy/build/pdf'),
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      fs: false,
      worker_threads: false,
    };

    return config;
  },
};