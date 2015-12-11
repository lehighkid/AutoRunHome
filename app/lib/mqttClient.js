/**
 * Created by admin on 12/10/15.
 */
var format = require('string-format');
var settings = require('./../../config/settings');
var mqtt = require('mqtt');

format.extend(String.prototype);

function operate(device, cmd, cb) {

  var lspcmds = {
    toggle: device.codes[1 - device.state],
    white: device.codes[1 - device.state],
    color: device.codes[1 - device.state],
    music: (device.codes[1 - device.state] === "on") ? "start" : "stop"
  };

  var msgs = {
    rf: {topic: settings.mqtt.rftopic.format(device.rpi, cmd), msg: String(device.codes[1 - device.state])},
    gpio: {topic: settings.mqtt.gpiotopic.format(device.rpi, device.pinNumber), msg: String(1 - device.state)},
    lsp: {topic: settings.mqtt.lsptopic.format(device.rpi, cmd), msg: String(lspcmds[cmd])}
  };

  var msg = msgs[device.subtype];
  var client  = mqtt.connect(settings.mqtt.broker);
  client.publish(msg.topic, msg.msg);
  client.end();

}

function broadcast(topic, msg, cb){
  var client  = mqtt.connect(settings.mqtt.broker);
  client.publish(topic, msg);
  client.end();
}

module.exports = {
  operate: operate,
  broadcast: broadcast
};
