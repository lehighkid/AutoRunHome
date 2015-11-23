/**
 * Created by admin on 8/6/15.
 */
var gpio = require('onoff').Gpio;
var settings = require('./../../config/settings');

function operate(id, cb) {

  try {
    var gd = new gpio(settings.gdoor.execpin, 'out');
    var iv = setInterval(function(){
      gd.writeSync(gd.readSync() === 0 ? 0 : 1)
    }, 500);
    setTimeout(function() {
      clearInterval(iv);
      gd.writeSync(0);
      gd.unexport();
    }, 501);
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


