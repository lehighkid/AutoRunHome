var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Device = mongoose.model('Device');
var auth = require('./../../config/passport');
var WifiBoxModule = require('./../lib/ledWifiBox');
var cmd = require('./../helpers/ledCommands.js');

var _endpoint;
var _settings;
var _passport;

function init (app, passport, settings) {
  _passport = passport;
  _settings = settings;
  app.use('/control', router);
}

function respond(endpoint, socket){
  _endpoint = endpoint;
}

router.get('/', /*auth.ensureAuthenticated,*/ function (req, res, next) {

  var led = new WifiBoxModule(_settings.milight.wifiboxip, _settings.milight.wifiboxport);
  led.command(cmd.rgbw.hue(130));
  led.command(cmd.rgb.hue(240));

  Device.aggregate([{ $match: {inuse: true}}, { $sort: {sortorder: 1}}, {$group:{_id: {type: {type: "$type", typeName: "$typeName"}}, devices: { $push: { id: "$_id", name: "$name", type: "$type", typeName: "$typeName", description: "$description", codes: "$codes", state: "$state", statechanged: "$statechanged", dataon: "$dataon", dataoff: "$dataoff", sortorder: "$sortorder", webcamurl: "$webcamurl"}}}}], function(err, devices){
    if (err) return next(err);
    res.render('control', {
      title: 'AutoRunHome - Control Your Home',
      devices: devices
    });
  });
});

module.exports = {
  init: init,
  respond: respond
};
