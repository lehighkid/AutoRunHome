var express = require('express'),
  http = require('http'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

//load all models
var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

var app = express();

// Create a server
var server = http.createServer(app);

var nodered = require('./config/nodered');
nodered.init(server, app);

require('./config/express')(app, config);

server.listen(config.port);

var io = require('socket.io').listen(server);
require('./config/socket')(io);

nodered.start();
