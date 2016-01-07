/**
 * Created by admin on 11/23/15.
 */
var format = require('string-format');
var http = require('http');
var settings = require('./../../config/settings');
var WifiBoxModule = require('./../helpers/ledWifiBox');
var wCmd = require('./../helpers/ledCommands');

format.extend(String.prototype);

function operate(miLightdevice, cmd, hex, hsl, rgb, cb) {
  var led = new WifiBoxModule(settings.milight.wifiboxip, settings.milight.wifiboxport);

  var cmdNm;
  var cmdGrp = wCmd[miLightdevice.subtype];
  var cmdF;
  if (cmd=='toggle') {
    cmdNm = (miLightdevice.state) ? 'off' : 'on';
    cmdF = cmdGrp[cmdNm](miLightdevice.zone)
  }
  else if (cmd=='hue') {
    cmdNm = cmd;
    var hOfhsl = hsl["h"];
    var color = hslToMilightColor(hOfhsl);
    cmdF = cmdGrp[cmdNm](miLightdevice.zone, color)
  }

  led.command(cmdF, function (err, result) {
    if (cb)
        cb(err, result);
    });


  //_led.command(cmd.rgbw.hue(100));
  //led.command(cmd.rgb.hue(240));
}

function hslToMilightColor(hOfhsl)
{
  return ~~(256 + 176 - (hOfhsl / 360.0 * 255.0)) % 256;
}

module.exports = {
  operate: operate
};
