var controlController = require('./../app/controllers/control');
var deviceoperateController = require('./../app/controllers/deviceoperate');
var devicestateController = require('./../app/controllers/devicestate');
//var watcher = require('./watcher');
//var dasher = require('./dasher');

module.exports = function(io){

	var push = io.of('/').on('connection', function(socket){
		controlController.respond(push, socket);
    deviceoperateController.respond(push, socket);
    devicestateController.respond(push, socket);
    //dasher.respond(push, socket);
    //watcher.respond(push, socket);

	});
};
