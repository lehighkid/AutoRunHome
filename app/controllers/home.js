var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Rfdevice = mongoose.model('Rfdevice'),
  bodyParser = require('body-parser'), //parses information from POST
  methodOverride = require('method-override'), //used to manipulate POST
  gpio = require('onoff').Gpio,
  exec = require('child_process').exec;

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method
  }
}));

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
}

function sendCode(code, onsuccess) {
  console.log(code);

	var child = exec('sudo /home/pi/commands/rfoutlet/codesend ' + code);

	// listen for outputs
	child.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
    onsuccess();
	});

	// listen for errors
	child.stderr.on('data', function(data) {
    		console.log('stdout: ' + data);
	});

	// listen for close
	child.on('close', function(code) {
    		console.log('closing code: ' + code);
	});

}

function updateState(id, state, endpoint) {
  Rfdevice.findById(id, function (err, rfdevice) {
    if (err) return next(err);
    rfdevice.state = state;
    rfdevice.save(function (err) {
      if (err) return next(err);
      console.log("State updated for " + id);
      var resp = {};
      resp.id = id;
      resp.state = state;
      var data = JSON.stringify(resp);
      endpoint.emit('stateUpdated', data)
    })
  });
}

module.exports.respond = function(endpoint, socket){

	socket.on('gDoor', function(data){
		gDoor();
		var msg = 'Garage door toggled by ' + data;
		console.log(msg);
		endpoint.emit('gDoorToggled', msg);
	});

	socket.on('sendrfcode', function(data){
		//sendCode(data);
    var device = JSON.parse(data);
    var state = (device.state.toLowerCase() == "false");
    console.log(state);
    sendCode(device.codes[+state], function(){updateState(device.id, state, endpoint)});
	});
};

router.get('/', function (req, res, next) {
  Rfdevice.find(function (err, rfdevices) {
    if (err) return next(err);
    res.render('index', {
      title: 'AutoRunHome - Control Your Home',
      rfdevices: rfdevices
    });
  });
});
