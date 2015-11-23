/**
 * Created by admin on 8/9/15.
 */
var express = require('express');
var router = express.Router();

var _settings;
var _passport = require('passport');

function init (app, passport, settings) {
  _passport = passport;
  _settings = settings;
  app.use('/login', router);
}

// show the login form
router.get('/', function(req, res) {
  res.render('login', { message: req.flash('loginMessage') });
});

// process the login form
router.post('/', _passport.authenticate('local-login', {
  successReturnToOrRedirect : '/',
  failureRedirect : '/login',
  failureFlash : true
}));

module.exports = {
  init: init
};
