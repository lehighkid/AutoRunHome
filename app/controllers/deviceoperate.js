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
var sammytv = require('./../lib/sammytv');
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
    deviceoperate(data, data.notify, data.source);
  });
}

function updatestate(deviceid, devicestate, notify, source, cb){
  devicestateController.setdevicestate(deviceid, devicestate, notify, source, function(err, resp){
    if (err) return err;
    if (cb) return cb(err, resp);
  });
}

function deviceoperate(data, notify, source, cb) {
  Device.search(data.deviceid, function (err, device) {
    if (err) return err;

    var deviceData = {
      deviceid: data.deviceid,
      cmd: data.cmd || device.cmd || 'toggle',
      hex: data.hex,
      hsl: data.hsl,
      rgb: data.rgb,
      updateState: data.updateState || true,
      device: device
    };

    var ops = {
      mqtt: function(devicedata, cb){
        mqtt.operate(device, devicedata.cmd, cb)
      },
      miLight: function(devicedata, cb){
        miLight.operate(devicedata.device, devicedata.cmd, devicedata.hex, devicedata.hsl, devicedata.rgb, cb)
      },
      sammytv: function(devicedata, cb){
        sammytv.operate(devicedata.device, devicedata.cmd, cb)
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
        updatestate(deviceData.deviceid, !deviceData.device.state, notify, source, function(err, resp){
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
router.route('/:device_id/:updatestate/:notify/:source')
  // get device type for id
  .get(function(req, res) {
    var data = {
      deviceid: req.params.device_id,
      updateState: req.params.updatestate
    };
    deviceoperate(data, req.params.notify, req.params.source, function(err, resp){
      if (err) return res.json(err);
      res.json(resp);
    });
  });

module.exports = {
  init: init,
  respond: respond,
  deviceoperate: deviceoperate
};
