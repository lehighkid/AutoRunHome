/**
 * Created by admin on 7/30/15.
 */
var gpio = require('onoff').Gpio;
var deviceState = require('./../app/controllers/devicestate');
var settings = require('./settings');

var _deviceId = settings.gdoor.deviceid;
var _endpoint;
var _closed;
var _open;
var _state = 'Closed';

function detectedState(cb){
  var state = 'Closed';

  if ((_closed + _open == 0) || (_closed + _open == 2)) {
    state = 'In Between';
  } else if (_closed - _open == 1){
    state = 'Closed';
  } else if (_open - _closed == 1){
    state = 'Open';
  }

  if (state != _state){
    _state = state;
    if ((_state == 'Open') || (_state == 'Closed')) {
      deviceState.setdevicestate(_deviceId, (_state == 'Open'), function(err, newdevicestate){
        console.log('gDoorStateDetected: ' + _state);
      });
    }
  }
    if (cb) return cb(state);
}

function respond(endpoint, socket){

  _endpoint = endpoint;

  var doorDownIf = new gpio(settings.gdoor.closedpin, 'in', 'both', {debounceTimeout: 20});
  var doorOpenIf = new gpio(settings.gdoor.openedpin, 'in', 'both', {debounceTimeout: 20});

  doorDownIf.watch(function(err, value) {
    if (err) return next(err);
    if (_closed != value){
      _closed = value;
      detectedState();
    }
    //console.log("c-" + value);

    //endpoint.emit('gDoorDown', value);
  });

  doorOpenIf.watch(function(err, value) {
    if (err) return next(err);
    if (_open != value){
      _open = value;
      detectedState();
    }
    //console.log("o-" + value);

    //endpoint.emit('gDoorOpen', value);
  });
}

module.exports = {
  respond: respond,
  state: detectedState
};
