/**
 * Created by admin on 8/9/15.
 */
var express = require('express');
var router = express.Router();

var _settings;
var _passport;

function init (app, passport, settings) {
  _passport = passport;
  _settings = settings;
  app.use('/home', router);
}

router.get('/', function (req, res, next) {
    res.render('index');
  });

module.exports = {
  init: init
};
