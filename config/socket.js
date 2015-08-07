var homeController = require('./../app/controllers/home');
var deviceoperateController = require('./../app/controllers/deviceoperate');
var watcher = require('./watcher');

module.exports = function(io){

	var push = io.of('/').on('connection', function(socket){
		homeController.respond(push, socket);
    deviceoperateController.respond(push, socket);
    watcher.init(push, socket);
	});
};
