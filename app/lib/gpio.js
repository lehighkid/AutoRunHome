/**
 * Created by admin on 12/1/15.
 */
var gpio = require('onoff').Gpio;
var settings = require('./../../config/settings');

function operate(device, code, cb) {
  try {
    //get pin num and state from database
    //toggle pin state

    var gDevice = new gpio(device.pinNumber, 'out');
    gDevice.writeSync((code=="on") ? 1 : 0);
  }
  catch (err) {
    if (cb) cb(err, -1);
  }
  finally {
    if (cb) cb('', 0);
  }
}

module.exports = {
  operate: operate
};
