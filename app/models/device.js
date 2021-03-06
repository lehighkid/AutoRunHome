/**
 * Created by admin on 8/5/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeviceSchema = new Schema({
    name: String
  , description: String
  , type: String
  , subtype: String
  , typeName: String
  , codes: [String]
  , state: Boolean
  , statechanged: Date
  , remotenum: Number
  , inuse: Boolean
  , sortorder: Number
  , webcamurl: String
  , zone: Number
  , dataon: String
  , dataoff: String
  , colorControl: Boolean
  , pinNumber: Number
  , channelNumber: Number
  , cmd : String
  , host: String
  , port: Number
  , rpi: String
  , ctrlType: String
  , ctrlText: String
  , execCmd: String
  , statesource: String
  , statenotified: Boolean
  , ipadd: String
  , controllerId: String
  , remoteName: String
  , nodeId: String
  , cmdClass: Number
  , topicName: String
  , duration: Number
  , isProgram: Number
});

// list all devices
DeviceSchema.statics.list = function list(cb) {
  return Device.find({}, function (err, devices) {
    if (cb) {
      cb(err, devices);
    }
  });
};

// search all devices by id
DeviceSchema.statics.search = function search(id, cb) {
  return Device.findById(id, function (err, device) {
    if (cb) {
      cb(err, device);
    }
  });
};

// update device state by id
DeviceSchema.statics.updateState = function updateState(id, state, statechanged, notify, source, cb){
  Device.findById(id, function (err, device) {
    if (err) return next(err);
    device.state = state;
    device.statechanged = statechanged;
    device.statenotified = notify;
    device.statesource = source;
    device.save(function(err) {
      if (err) return next(err);
      if (cb) {
        cb(err, device);
      }
    });
  });
};

// create new device
DeviceSchema.statics.create = function create(name, description, type, subtype, typename, codes, remotenum, inuse, sortorder, webcamurl, state, zone, colorcontrol, pinnumber, channelnumber, host, port, cmd, rpi, ctrltype, ctrltext, execcmd, ipadd, controllerid, remotename, nodeid, cmdclass, topicname, duration, isprogram, cb) {
  var newdevice = new Device ({
    name: name,
    description: description,
    type: type,
    subtype: type,
    typeName: typename,
    codes: codes,
    remotenum: remotenum,
    inuse: inuse,
    state: state,
    statechanged: new Date(),
    sortorder: sortorder,
    webcamurl: webcamurl,
    zone: zone,
    colorControl: colorcontrol,
    pinNumber: pinnumber,
    channelNumber: channelnumber,
    cmd: cmd,
    host: host,
    port: port,
    rpi: rpi,
    ctrlType: ctrltype,
    ctrlText: ctrltext,
    execCmd: execcmd,
    ipadd: ipadd,
    controllerId: controllerid,
    remoteName: remotename,
    nodeId: nodeid,
    cmdClass: cmdclass,
    topicName: topicname,
    duration: duration,
    isProgram: isprogram
  });
  newdevice.save(function(err) {
    if (err) return next(err);
    if (cb) cb(err, newdevice);
  });
};

//TODO: Research why remove functions do not limit to 1 document
// delete device by id
DeviceSchema.statics.delete = function remove(id, cb) {
  return Device.findByIdAndRemove(id, function (err) {
    if (cb) {
      cb(err, string.json({'message': 'Device: ' + id + ' deleted'}));
    }
  });
};

var Device = mongoose.model('Device', DeviceSchema);
module.exports = Device;
