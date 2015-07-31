var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  moment = require('moment'),
  Rfdevice = mongoose.model('Rfdevice'),
  Rfstatechange = mongoose.model('Rfstatechange'),
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
    clearInterval(iv);
    gd.writeSync(0);
    gd.unexport();
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
  Rfdevice.findById(id, function(err, rfdevice) {
    if (err) return next(err);
    rfstatechange = new Rfstatechange({
      _rfdevice: rfdevice._id
      , state: state
    });
    rfstatechange.save(function(err){
      if (err) return next(err);
      rfdevice.state = state;
      rfdevice.statechanged = new Date();
      rfdevice.save(function(err) {
        if (err) return next(err);
        console.log("State updated for " + id);
        var resp = {};
        resp.id = id;
        resp.state = state;
        resp.statechanged = moment(rfdevice.statechanged).format("MM/DD/YY HH:mm:ss");
        var data = JSON.stringify(resp);
        endpoint.emit('stateUpdated', data)
      });
    })
  });
}

module.exports.respond = function(endpoint, socket){

  socket.on('gDoorOpen', function(data){
    var msg = 'Garage door open event emit fired with ' + data;
    console.log(msg);
  });

  socket.on('gDoorDown', function(data){
    var msg = 'Garage door down event emit fired with ' + data;
    console.log(msg);
  });

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
    sendCode(device.codes[+state], function(){updateState(device.id, state, endpoint)});
	});
};

router.get('/', function (req, res, next) {
  Rfdevice.find({ $query: {inuse : true}, $orderby: { sortorder : 1 } }, function (err, rfdevices) {
    if (err) return next(err);
    res.render('index', {
      title: 'AutoRunHome - Control Your Home',
      rfdevices: rfdevices
    });
  });
});
