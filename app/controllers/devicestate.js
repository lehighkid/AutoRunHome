/**
 * Created by admin on 8/5/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var Devicestate = mongoose.model('Devicestate');

function init (app, passport) {
  app.use('/devicestate', router);
}

var _endpoint;
var _socket;

function respond(endpoint, socket){
  _endpoint = endpoint;
  _socket = socket;
}

function setdevicestate(deviceid, devicestate, cb) {
  Devicestate.create(deviceid, devicestate, function (err, newdevicestate) {
    if (err) return next(err);
    var resp = {
      id: newdevicestate._device,
      state: newdevicestate.state,
      changed: moment(newdevicestate.changed).format("MM/DD/YY HH:mm:ss")
    };
    _endpoint.emit('deviceoperated', JSON.stringify(resp));
    if (cb) return cb(err, newdevicestate)
  });
}

// set device state
router.route('/:device_id/:device_state')
  .put(function(req, res) {
    setdevicestate(req.params.device_id, req.params.device_state, function(err, resp){
      if (err) return next(err);
      res.json(resp);
    });
  });

// get device state by device id
router.route('/:device_id')
  .get(function(req, res) {
    Devicestate.search(req.params.device_id, function (err, devicestate) {
      if (err) return next(err);
      res.json(devicestate);
    });
  });

module.exports = {
  init: init,
  respond: respond,
  setdevicestate: setdevicestate
};
