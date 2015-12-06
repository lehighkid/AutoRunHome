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
var mqtt = require('./../lib/mqtt');
var lightshowpi = require('./../lib/lightshowpi');
var dLock = require('./../lib/dLock');
var gpio = require('./../lib/gpio');
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
  var cmd = data.cmd || 'toggle';
  var hex = data.hex;
  var updateState = data.updateState || true;
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
    // lightshowpi device logic
    else if (device.type === "lightshowpi") {
      lightshowpi.sendcode(device.channelNumber, device.codes[1 - device.state], cmd, function (err, result) {
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
    // mqtt logic
    else if (device.type === "mqtt") {
      mqtt.sendcode(device.codes[1 - device.state], function (err, result) {
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
    // gpio device logic
    else if (device.type === "gpio") {
      gpio.operate(device, device.codes[1 - device.state], function (err, result) {
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
    var data = {
      deviceid: req.params.device_id
    };
    deviceoperate(data, function(err, resp){
      if (err) return res.json(err);
      res.json(resp);
    });
  });

module.exports = {
  init: init,
  respond: respond,
  deviceoperate: deviceoperate
};
