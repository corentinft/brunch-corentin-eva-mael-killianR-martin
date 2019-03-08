// See http://brunch.io for documentation.
exports.files = {
  javascripts: {
    joinTo: {
      'vendor.js': /^(?!app)/, // Files that are not in `app` dir.
      'app.js': /^app/
    }
  },
  stylesheets: {joinTo: 'app.css'}
};

exports.plugins = {
  babel: {presets: ['latest']},
  eslint: {
    config: {
      rules: {semi: 0},
    },
    pattern: /^src\/.*\.jsx?$/,
    warnOnly: false,
    formatter: 'table',
  }
};
