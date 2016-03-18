/**
 * Created by aarondrago on 3/18/16.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sensor = mongoose.model('Sensor');
var SensorReading = mongoose.model('Sensorreading');

var _endpoint;
var _socket;
var _settings;
var _passport;

function init (app, passport, settings) {
  _passport = passport;
  _settings = settings;
  app.use('/sensorreading', router);
}

function respond(endpoint, socket){
  _endpoint = endpoint;
  _socket = socket;
}

// get device state by sensor id
router.route('/:sensor_id')
  .get(function(req, res) {
    SensorReading.search(req.params.sensor_id, function (err, sensorreading) {
      if (err) return next(err);
      res.json(sensorreading);
    });
  });

// insert new device
router.route('/')
  .post(function(req, res) {
    SensorReading.create(
      _sensor = req.body.sensorid,
      readingtype = req.body.readingtype,
      value = req.body.value,
      source = req.body.source,
      function(err, newsensorreading) {
        if (err) return next(err);
        res.json(newsensorreading);
      }
    );
  });


module.exports = {
  init: init,
  respond: respond
};
