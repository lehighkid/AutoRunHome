/**
 * Created by admin on 8/9/15.
 */
var express = require('express');
var router = express.Router();
var auth = require('./../../config/passport');

var _settings;
var _passport;

function init (app, passport, settings) {
  _passport = passport;
  _settings = settings;
  app.use('/profile', router);
}

router.get('/', auth.ensureAuthenticated, function (req, res, next) {
  console.log("req.user = " + req.user);
    res.render('profile', {
      user: req.user
    });
  });

module.exports = {
  init: init
};
