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

module.exports = function (app) {
  app.use('/deviceoperate', router);
};

var _endpoint;
var _socket;

module.exports.respond = function(endpoint, socket){
  _endpoint = endpoint;
  _socket = socket;
};

//TODO:
// 1) move redundant code into a separate function for updating state
// 2) add logic to interpret 'result' should be set to 0 in both cases
// 3) add logic for other types - setup globally
// 4) add listener function for events to move out of home controller

// set command to operate device
router.route('/:device_id')
  // get device type for id
  .get(function(req, res) {
    var deviceid = req.params.device_id;
    Device.search(deviceid, function (err, device) {
      if (err) return next(err);
      var devicestate = !device.state;

      // garage door logic
      if (device.type === "gDoor") {
        gDoor.operate(device.id, function (err, result) {
          if (err) return next(err);
          Devicestate.create(deviceid, devicestate, function(err, newdevicestate) {
            if (err) return next(err);
            var resp = {};
            resp.id = deviceid;
            resp.state = devicestate;
            resp.statechanged = moment(newdevicestate.changed).format("MM/DD/YY HH:mm:ss");
            var data = JSON.stringify(resp);
            _endpoint.emit('gdstateupdated', data);
            res.json(newdevicestate);
          });
        });
      }

      // rf device logic
      if (device.type === "rfDevice") {
        rfDevice.sendcode(device.codes[+devicestate], function (err, result) {
          if (err) return next(err);
          Devicestate.create(deviceid, devicestate, function(err, newdevicestate) {
            if (err) return next(err);
            var resp = {};
            resp.id = deviceid;
            resp.state = devicestate;
            resp.statechanged = moment(newdevicestate.changed).format("MM/DD/YY HH:mm:ss");
            var data = JSON.stringify(resp);
            _endpoint.emit('rfstateupdated', data);
            res.json(newdevicestate);
          });
        });
      }
      //else res.json("operation could not be completed");
    });
  });
