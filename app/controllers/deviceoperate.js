/**
 * Created by admin on 8/6/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Device = mongoose.model('Device');
var Devicestate = mongoose.model('Devicestate');
var gDoor = require('./../lib/gDoor.js');
var rfDevice = require('./../lib/rfDevice.js');
var moment = require('moment');
var devicestateController = require('./devicestate');

function init(app) {
  app.use('/deviceoperate', router);
}

var _endpoint;

function respond(endpoint, socket){
  _endpoint = endpoint;

  socket.on('deviceoperate', function(data){
    deviceoperate(data);
  });
}

function deviceoperate(deviceid, cb){
  Device.search(deviceid, function (err, device) {
    if (err) return next(err);
    // garage door logic
    if (device.type === "gDoor") {
      gDoor.operate(device.id, function (err, result) {
        if (err) return next(err);
      });
    }
    // rf device logic
    else if (device.type === "rfDevice") {
      rfDevice.sendcode(device.codes[1 - device.state], function (err, result) {
        if (err) return next(err);
      });
    }
  // update and log device state change
  devicestateController.setdevicestate(deviceid, !device.state, function(err, resp){
    if (err) return next(err);
    if (cb) return cb(err, resp);
  });
});
}

// set command to operate device
router.route('/:device_id')
  // get device type for id
  .get(function(req, res) {
      deviceoperate(req.params.device_id, function(err, resp){
        if (err) return next(err);
        res.json(resp);
      });
  });

module.exports = {
  init: init,
  respond: respond,
  deviceoperate: deviceoperate
};
