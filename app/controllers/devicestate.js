/**
 * Created by admin on 8/5/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Devicestate = mongoose.model('Devicestate');

module.exports = function (app) {
  app.use('/devicestate', router);
};

// set device state
router.route('/:device_id/:device_state')
  .put(function(req, res) {
    Devicestate.create(req.params.device_id, req.params.device_state, function(err, devicestate) {
        if (err) return next(err);
        res.json(devicestate);
      }
    );
  });

// get device state by device id
router.route('/:device_id')
  .get(function(req, res) {
    Devicestate.search(req.params.device_id, function (err, devicestate) {
      if (err) return next(err);
      res.json(devicestate);
    });
  });

