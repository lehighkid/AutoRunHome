var controlController = require('./../app/controllers/control');
var deviceoperateController = require('./../app/controllers/deviceoperate');
var devicestateController = require('./../app/controllers/devicestate');

module.exports = function(io){

	var push = io.of('/').on('connection', function(socket){
		controlController.respond(push, socket);
    deviceoperateController.respond(push, socket);
    devicestateController.respond(push, socket);

	});
};
