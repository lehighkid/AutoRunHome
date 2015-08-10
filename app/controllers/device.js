/**
 * Created by admin on 8/5/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Device = mongoose.model('Device');

// Define routes handling profile requests

function init(app, passport) {
  app.use('/device', router);
}

router.route('/:device_id')
  // get device by id
  .get(function(req, res) {
    Device.search(req.params.device_id, function (err, device) {
      if (err) return next(err);
      res.json(device);
    });
  })

  // update device by id
  .put(function(req, res) {
    name = req.body.Name;
    res.json({ message: 'put w/ id request - ' + req.params.device_id + ' - ' + name});
  })

  // delete device by id  - disabled since it will delete ALL devices
/*  .delete(function(req, res) {
    Device.remove(req.params.device_id, function (err, msg) {
      if (err) return next(err);
      res.json(msg);
    });
  })*/;

router.route('/')
  //get all devices
  .get(function(req, res) {
    Device.list(function (err, devices) {
      if (err) return next(err);
      res.json(devices);
    });
  })

  // insert new device
  .post(function(req, res) {
    Device.create(
      name = req.body.devicename,
      description = req.body.description,
      type = req.body.devicetype,
      codes = req.body.codes,
      remotenum = req.body.remotenum,
      inuse = req.body.inuse,
      sortorder = req.body.sortorder,
      state = req.body.state,
      webcamurl = req.body.webcamurl,
      function(err, newdevice) {
        if (err) return next(err);
        res.json(newdevice);
      }
    );
  });

module.exports = {
  init: init
};
