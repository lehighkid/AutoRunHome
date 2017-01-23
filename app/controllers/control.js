var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Device = mongoose.model('Device');
var auth = require('./../../config/passport');

var _endpoint;
var _settings;
var _passport;

function init (app, passport, settings) {
  _passport = passport;
  _settings = settings;
  app.use('/', router);
}

function respond(endpoint, socket){
  _endpoint = endpoint;
}

router.get('/', /*auth.ensureAuthenticated,*/ function (req, res, next) {

  Device.aggregate([{ $match: {inuse: true}}, { $sort: {typeName:1, sortorder:1}}, {$group:{_id: {type: {typeName: "$typeName"}}, devices: { $push: { id: "$_id", name: "$name", type: "$type", typeName: "$typeName", state: "$state", statechanged: "$statechanged", dataon: "$dataon", dataoff: "$dataoff", webcamurl: "$webcamurl", colorControl: "$colorControl", ctrlType: "$ctrlType", ctrlText: "$ctrlText"}}}}], function(err, devices){
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
