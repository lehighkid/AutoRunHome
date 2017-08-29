/**
 * Created by admin on 12/10/15.
 */
var format = require('string-format');
var settings = require('./../../config/settings');
var mqtt = require('mqtt');
var fs = require('fs');

format.extend(String.prototype);

var options = {
  port: settings.mqtt.port,
  host: settings.mqtt.host,
  key: fs.readFileSync(settings.mqtt.key),
  cert: fs.readFileSync(settings.mqtt.cert),
  ca: fs.readFileSync(settings.mqtt.ca),
  protocol: 'mqtts',    //also add this
  //protocolId: 'MQIsdp',
  secureProtocol: 'TLSv1_method',
  //protocolVersion: 3
  //rejectUnauthorized: false
};

function operate(device, cmd, cb) {

  var lspcmds = {
    toggle: device.codes[1 - device.state],
    white: device.codes[1 - device.state],
    color: device.codes[1 - device.state],
    bushes: device.codes[1 - device.state],
    music: (device.codes[1 - device.state] === "on") ? "start" : "stop",
    random: (device.codes[1 - device.state] === "on") ? "start" : "stop",
    sequence: (device.codes[1 - device.state] === "on") ? "start" : "stop"
  };

  var msgs = {
    rf: {topic: settings.mqtt.rftopic.format(device.rpi, cmd), msg: String(device.codes[1 - device.state])},
    ir: {topic: settings.mqtt.irtopic.format(device.rpi, cmd), msg: String(device.codes[1 - device.state])},
    gpio: {topic: settings.mqtt.gpiotopic.format(device.rpi, device.channelNumber), msg: String(1 - device.state)},
    wemo: {topic: settings.mqtt.wemotopic.format(device.rpi, device._id), msg: String(1 - device.state)},
    alarm: {topic: settings.mqtt.alarmtopic.format(cmd), msg: String(device.codes[1 - device.state])},
    lsp: {topic: settings.mqtt.lsptopic.format(device.rpi, cmd), msg: String(lspcmds[cmd])},
    cmd: {topic: settings.mqtt.cmdtopic.format(device.rpi, cmd), msg: String(device.execCmd).format(device.codes[1 - device.state])},
    door: {topic: settings.mqtt.doortopic.format(device.rpi, cmd), msg: String(device.codes[1 - device.state])},
    zwave: {topic: settings.mqtt.zwavetopic.format(device.rpi, device.nodeId, device.cmdClass), msg: String(device.codes[1 - device.state])},
    horn: {topic: settings.mqtt.horntopic.format(device.rpi, cmd), msg: String(device.execCmd)},
    group: {topic: settings.mqtt.grptopic.format(device.rpi, cmd), msg: String(!device.state)},
    controller: {topic: settings.mqtt.ctrltopic.format(device.controllerId, device._id), msg: String(device.codes[1 - device.state])},
    sonoff: {topic: settings.mqtt.sonofftopic.format(device.topicName, device.channelNumber), msg: String(device.codes[1 - device.state])},
    ospi: {topic: settings.mqtt.ospitopic.format(String(device.isProgram), String(device.zone), String(device.duration)), msg: String(device.codes[1 - device.state])}
  };

  var msg = msgs[device.subtype];
  var client  = mqtt.connect(options);
  client.publish(msg.topic, msg.msg);
  client.end();

}

function broadcast(topic, msg, cb){
  var client  = mqtt.connect(options);
  client.publish(topic, msg);
  client.end();
}

module.exports = {
  operate: operate,
  broadcast: broadcast
};
