var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  moment = require('moment'),
  Rfdevice = mongoose.model('Rfdevice'),
  Rfstatechange = mongoose.model('Rfstatechange'),
  Garagedoor = mongoose.model('Garagedoor'),
  Garagedoorstatechange = mongoose.model('Garagedoorstatechange'),
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

function gdOperate(id, onsuccess) {
  //TODO:  add logic based on garage door id
  //TODO:  wrap logic in try/catch block
  //TODO:  add logic to read pins
  //TODO:  cleanup timer loops
	var gd = new gpio(16, 'out');

	var iv = setInterval(function(){
    gd.writeSync(gd.readSync() === 0 ? 0 : 1)
	}, 500);

	setTimeout(function() {
    clearInterval(iv);
    gd.writeSync(0);
    gd.unexport();
	}, 501);

  onsuccess();
}

function gdupdateState(id, state, endpoint) {
  Garagedoor.findById(id, function(err, garagedoor) {
    if (err) return next(err);
    garagedoorstatechange = new Garagedoorstatechange({
      _garagedoor: garagedoor._id
      , state: state
    });
    garagedoorstatechange.save(function(err){
      if (err) return next(err);
      garagedoor.state = state;
      garagedoor.statechanged = new Date();
      garagedoor.save(function(err) {
        if (err) return next(err);
        console.log("Garage door state updated for " + id);
        var resp = {};
        resp.id = id;
        resp.state = state;
        resp.statechanged = moment(garagedoor.statechanged).format("MM/DD/YY HH:mm:ss");
        var data = JSON.stringify(resp);
        endpoint.emit('gdstateupdated', data)
      });
    })
  });
}

function rfsendCode(code, onsuccess) {
  //TODO:  wrap logig in try/catch block
  //TODO:  interpret exec results properly
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

function rfupdateState(id, state, endpoint) {
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
        console.log("RF device state updated for " + id);
        var resp = {};
        resp.id = id;
        resp.state = state;
        resp.statechanged = moment(rfdevice.statechanged).format("MM/DD/YY HH:mm:ss");
        var data = JSON.stringify(resp);
        endpoint.emit('rfstateupdated', data)
      });
    })
  });
}

module.exports.respond = function(endpoint, socket){

  socket.on('gdtoggle', function(data){
    var door = JSON.parse(data);
    var state = (door.state.toLowerCase() == "false");
    gdOperate(door.id, function(){gdupdateState(door.id, state, endpoint)});
	});

	socket.on('rfsendcode', function(data){
    var device = JSON.parse(data);
    var state = (device.state.toLowerCase() == "false");
    rfsendCode(device.codes[+state], function(){rfupdateState(device.id, state, endpoint)});
	});
};

router.get('/', function (req, res, next) {
  Rfdevice.find({$query: {inuse : true}, $orderby: { sortorder : 1 }}, function (err, rfdevices) {
    if (err) return next(err);
    Garagedoor.find({$query: {inuse : true}, $orderby: { sortorder : 1 }}, function (err, garagedoors) {
      if (err) return next(err);
      res.render('index', {
        title: 'AutoRunHome - Control Your Home',
        rfdevices: rfdevices,
        garagedoors: garagedoors
      });
    });
  });
});
