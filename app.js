var express = require('express');
var http = require('http');
var config = require('./config/config');
var glob = require('glob');
var mongoose = require('mongoose');

mongoose.connect(config.db, {useMongoClient: true});
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

var exp = require('./config/express');
exp.init(app, config);

server.listen(config.port);

var io = require('socket.io').listen(server);
require('./config/socket')(io);

//nodered.start();
