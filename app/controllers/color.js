/**
 * Created by admin on 8/23/15.
 */
var express = require('express');
var router = express.Router();

var _endpoint;
var _settings;
var _passport;

function init (app, passport, settings) {
  _passport = passport;
  _settings = settings;
  app.use('/color', router);
}
function respond(endpoint, socket){
  _endpoint = endpoint;
}

router.get('/', function (req, res, next) {
    res.render('color');
});

module.exports = {
  init: init,
  respond: respond
};
