var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Device = mongoose.model('Device');

var _endpoint;

function init (app) {
  app.use('/', router);
}
function respond(endpoint, socket){
  _endpoint = endpoint;
}

router.get('/', function (req, res, next) {
  Device.aggregate([{ $match: {inuse: true}}, { $sort: {sortorder: 1}}, {$group:{_id: {type: {type: "$type"}}, devices: { $push: { id: "$_id", name: "$name", type: "$type", description: "$description", codes: "$codes", state: "$state", statechanged: "$statechanged", sortorder: "$sortorder", webcamurl: "$webcamurl"}}}}], function(err, devices){
    if (err) return next(err);
    res.render('index', {
      title: 'AutoRunHome - Control Your Home',
      devices: devices
    });
  });
});

module.exports = {
  init: init,
  respond: respond
};
