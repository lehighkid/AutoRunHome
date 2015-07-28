var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'autorunhome'
    },
    port: 3000,
    db: 'mongodb://localhost/autorunhome-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'autorunhome'
    },
    port: 3000,
    db: 'mongodb://localhost/autorunhome-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'autorunhome'
    },
    port: 3000,
    db: 'mongodb://localhost/autorunhome-production'
  }
};

module.exports = config[env];
