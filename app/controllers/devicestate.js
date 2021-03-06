/**
 * Created by admin on 8/5/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var Device = mongoose.model('Device');
var Devicestate = mongoose.model('Devicestate');
var mqtt = require('./../lib/mqttClient');

var _endpoint;
var _socket;
var _settings;
var _passport;

function init (app, passport, settings) {
  _passport = passport;
  _settings = settings;
  app.use('/devicestate', router);
}

function respond(endpoint, socket){
  _endpoint = endpoint;
  _socket = socket;
}

function setdevicestate(deviceid, devicestate, notify, source, cb) {
  console.log('devicestate change requsted: ' + deviceid + ' to ' + devicestate);
    Devicestate.create(deviceid, devicestate, notify, source, function (err, newdevicestate) {
      if (err) return next(err);
      var resp = {
        id: newdevicestate.id,
        state: newdevicestate.state,
        changed: moment(newdevicestate.changed).format("MM/DD/YY HH:mm:ss"),
        name: newdevicestate.name,
        notify: newdevicestate.notify,
        source: newdevicestate.source
      };

      // socket.io update for web client
      _endpoint.emit('deviceoperated', JSON.stringify(resp));

      //if(notify) {
        // mqtt update for node-red clients
        var topic = 'devicestatechange/{0}/{1}/{2}/{3}'.format(deviceid, resp.state, notify, source);
        mqtt.broadcast(topic, JSON.stringify(resp));
      //}

      if (cb) return cb(err, newdevicestate);
    });
}

// set device state
router.route('/:device_id/:device_state/:notify/:source')
  .put(function(req, res) {
    setdevicestate(req.params.device_id, req.params.device_state, req.params.notify, req.params.source, function(err, resp){
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
