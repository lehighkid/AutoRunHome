/**
 * Created by admin on 11/23/15.
 */
var format = require('string-format');
var http = require('http');
var settings = require('./../../config/settings');
var WifiBoxModule = require('./../helpers/ledWifiBox');
var cmd = require('./../helpers/ledCommands');

format.extend(String.prototype);

function operate(miLightdevice, cb) {
  var led = new WifiBoxModule(settings.milight.wifiboxip, settings.milight.wifiboxport);
  if(miLightdevice.state) {
    led.command(cmd.rgbw.off(miLightdevice.zone), function (err, result) {
      if (cb)
        cb(err, result);
    });
  }
  else {
    led.command(cmd.rgbw.on(miLightdevice.zone), function (err, result) {
      if (cb)
        cb(err, result);
    });
  }

  //_led.command(cmd.rgbw.hue(100));
  //led.command(cmd.rgb.hue(240));
}

module.exports = {
  operate: operate
};
