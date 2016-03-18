/**
 * Created by aarondrago on 3/18/16.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sensor = mongoose.model('Sensor');

// Define routes handling profile requests

var _settings;
var _passport;

function init(app, passport, settings) {
  _passport = passport;
  _settings = settings;
  app.use('/sensor', router);
}

router.route('/:sensor_id')
  // get device by id
  .get(function(req, res) {
    Sensor.search(req.params.sensor_id, function (err, sensor) {
      if (err) return next(err);
      res.json(sensor);
    });
  })

  // update device by id
  .put(function(req, res) {
    name = req.body.Name;
    res.json({ message: 'put w/ id request - ' + req.params.sensor_id + ' - ' + name});
  });

  // delete device by id  - disabled since it will delete ALL devices
  /*  .delete(function(req, res) {
   Device.remove(req.params.device_id, function (err, msg) {
   if (err) return next(err);
   res.json(msg);
   });
   })*/

router.route('/')
  //get all devices
  .get(function(req, res) {
    Sensor.list(function (err, sensors) {
      if (err) return next(err);
      res.json(sensors);
    });
  })

  // insert new device
  .post(function(req, res) {
    Sensor.create(
      name = req.body.sensorname,
      description = req.body.description,
      type = req.body.sensortype,
      subtype = req.body.subtype,
      typeName = req.body.typeName,
      inuse = req.body.inuse,
      sortorder = req.body.sortorder,
      rpi = req.body.rpi,
      controllerId = req.body.controllerid,
      function(err, newsensor) {
        if (err) return next(err);
        res.json(newsensor);
      }
    );
  });

module.exports = {
  init: init
};
