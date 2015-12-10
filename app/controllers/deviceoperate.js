/**
 * Created by admin on 8/6/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Device = mongoose.model('Device');
var Devicestate = mongoose.model('Devicestate');
var mqtt = require('./../lib/mqttClient');
var miLight = require('./../lib/miLight');
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

function updatestate(deviceid, devicestate, cb){
  devicestateController.setdevicestate(deviceid, devicestate, function(err, resp){
    if (err) return err;
    if (cb) return cb(err, resp);
  });
}

function deviceoperate(data, cb) {
  Device.search(data.deviceid, function (err, device) {
    if (err) return err;

    var deviceData = {
      deviceid: data.deviceid,
      cmd: data.cmd || 'toggle',
      hex: data.cmd || 127,
      updateState: data.updateState || true,
      device: device
    };

    var ops = {
      mqtt: function(devicedata, cb){
        mqtt.operate(device, devicedata.cmd, cb)
      },
      miLight: function(devicedata, cb){
        miLight.operate(devicedata.device, devicedata.cmd, devicedata.hex, cb)
      }
    };

    try {
      ops[device.type](deviceData, function(err, result){
        if(err) return (err);
      });
    }
    catch (err) {
      if (cb) cb(err, -1);
    }
    finally {
      if(data.updateState){
        updatestate(deviceData.deviceid, !deviceData.device.state, function(err, resp){
          //console.log("State Update Request: err:", err, " resp: ", resp);
          if(cb) return cb(err, resp);
        });
      }
      else {
        if (cb) cb('', 0);
      }
    }
  });
}

// set command to operate device
router.route('/:device_id/:updatestate')
  // get device type for id
  .get(function(req, res) {
    var data = {
      deviceid: req.params.device_id,
      updateState: req.params.updatestate
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
