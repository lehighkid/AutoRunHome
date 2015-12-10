/**
 * Created by admin on 12/3/15.
 */
var format = require('string-format');
var exec = require('child_process').exec;
var settings = require('./../../config/settings');

format.extend(String.prototype);

function operate(device, cmd, cb) {
  //TODO:  wrap logig in try/catch block
  //TODO:  interpret exec results properly

  var lspcmds = {
    toggle: device.codes[1 - device.state],
    white: device.codes[1 - device.state],
    color: device.codes[1 - device.state],
    music: (device.codes[1 - device.state] === "on") ? "start" : "stop"
  };

  var tops = {
    rf: settings.mqtt.execcmd.format(device.host, device.port, settings.mqtt.rftopic.format(device.rpi, cmd), device.codes[1 - device.state]),
    gpio: settings.mqtt.execcmd.format(device.host, device.port, settings.mqtt.gpiotopic.format(device.rpi, device.pinNumber), 1 - device.state),
    lsp: settings.mqtt.execcmd.format(device.host, device.port, settings.mqtt.lsptopic.format(device.rpi, cmd), lspcmds[cmd])
  };

  var mcmd = tops[device.subtype];

  console.log(mcmd);
  var child = exec(mcmd);

  // listen for outputs
  child.stdout.on('data', function(data) {
    console.log('info:' + data);
  });

  // listen for errors
  child.stderr.on('data', function(data) {
    console.log('error:' + data);
  });

  // listen for close
  child.on('close', function(code) {
    if (cb) cb(null, code);
  });

}

module.exports = {
  operate: operate
};
