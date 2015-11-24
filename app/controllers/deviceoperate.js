/**
 * Created by admin on 8/6/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Device = mongoose.model('Device');
var Devicestate = mongoose.model('Devicestate');
var gDoor = require('./../lib/gDoor');
var rfDevice = require('./../lib/rfDevice');
var dLock = require('./../lib/dLock');
var miLight = require('./../lib/miLight');
var moment = require('moment');
var devicestateController = require('./devicestate');

var _endpoint;
var _settings;
var _passport;

function init(app, passport, settings) {
  _passport = passport;
  _settings = settings;
  app.use('/deviceoperate', router);
}


function respond(endpoint, socket){
    _endpoint = endpoint;

  socket.on('deviceoperate', function(data){
    deviceoperate(data);
  });
}

function deviceoperate(data, cb){
  var deviceid = data.deviceid;
  var cmd = data.cmd;
  var hex = data.hex;
  var updateState = data.updateState;
  Device.search(deviceid, function (err, device) {
    if (err) return err;
    // garage door logic
    if (device.type === "gDoor") {
      gDoor.operate(device.id, function (err, result) {
        if (err) return err;
      });
      // jump out of state loop since automatically detected by door
      if (cb) return cb(err, result);
    }
    // rf device logic
    else if (device.type === "rfDevice") {
      rfDevice.sendcode(device.codes[1 - device.state], function (err, result) {
        if (err) return err;
        // update and log device state change
        if(updateState){
          devicestateController.setdevicestate(deviceid, !device.state, function(err, resp){
            if (err) return err;
            if (cb) return cb(err, resp);
          });
        }
      });
    }
    // door lock device logic
    else if (device.type === "dLock") {
      dLock.operate(device.codes[1 - device.state], function (err, result) {
        if (err) return err;
        // update and log device state change
        if(updateState){
          devicestateController.setdevicestate(deviceid, !device.state, function(err, resp){
            if (err) return err;
            if (cb) return cb(err, resp);
          });
        }
      });
    }
    // milight device logic
    else if (device.type === "miLight") {
      miLight.operate(device, cmd, hex, function (err, result) {
        if (err) return err;
        // update and log device state change
        if(updateState){
          devicestateController.setdevicestate(deviceid, !device.state, function(err, resp){
            if (err) return err;
            if (cb) return cb(err, resp);
          });
        }
      });
    }

});
}

// set command to operate device
router.route('/:device_id')
  // get device type for id
  .get(function(req, res) {
      deviceoperate(req.params.device_id, function(err, resp){
        if (err) return err;
        res.json(resp);
      });
  });

module.exports = {
  init: init,
  respond: respond,
  deviceoperate: deviceoperate
};
