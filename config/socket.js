var homeController = require('./../app/controllers/home');
var watcher = require('./watcher');

module.exports = function(io){

	var push = io.of('/').on('connection', function(socket){
		homeController.respond(push, socket);
    watcher.init(push, socket);
	});
};
