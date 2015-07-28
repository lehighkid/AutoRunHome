var homeController = require('./../app/controllers/home');

module.exports = function(io){

	var color = io.of('/').on('connection', function(socket){
		homeController.respond(color, socket);
	});
};
