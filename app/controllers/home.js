var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Outlet = mongoose.model('Outlet'),
  Command = mongoose.model('Command'),
  gpio = require('onoff').Gpio,
  exec = require('child_process').exec;

module.exports = function (app) {
  app.use('/', router);
};

function gDoor() {
	var gd = new gpio(16, 'out');

	var iv = setInterval(function(){
        	gd.writeSync(gd.readSync() === 0 ? 0 : 1)
	}, 500);
 
	setTimeout(function() {
    		clearInterval(iv); // Stop blinking
    		gd.writeSync(0);  // Turn LED off.
   		gd.unexport();    // Unexport GPIO and free resources
	}, 5000);
};

function sendCode(code) {
	var child = exec('sudo /home/pi/commands/rfoutlet/codesend ' + code);

	// listen for outputs
	child.stdout.on('data', function(data) {
    		console.log('stdout: ' + data);
	});

	// listen for errors
	child.stderr.on('data', function(data) {
    		console.log('stdout: ' + data);
	});

	// listen for close
	child.on('close', function(code) {
    		console.log('closing code: ' + code);
	});

};

module.exports.respond = function(endpoint, socket){
	socket.on('click', function(data){
		gDoor();
		endpoint.emit('changeColor',data);
	});

	socket.on('gDoor', function(data){
		gDoor();
		var msg = 'Garage door toggled by ' + data;
		console.log(msg);
		endpoint.emit('gDoorToggled', msg);
	});
	
	socket.on('click2', function(data){
		sendCode(data);
		endpoint.emit('resetColor',data);
	});
};

router.get('/', function (req, res, next) {
  Outlet.find(function (err, outlets) {
    if (err) return next(err);
    Command.find(function (err, commands) {
      if (err) return next(err);
        res.render('index', {
        title: 'Generator-Express MVC',
        outlets: outlets,
	commands: commands
      });
    });
  });
});
