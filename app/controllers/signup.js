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
  app.use('/signup', router);
}

// SIGNUP =================================
// show the signup form
router.get('/', function(req, res) {
  res.render('signup', { message: req.flash('loginMessage') });
});

// process the signup form
router.post('/', _passport.authenticate('local-signup', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/signup', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

module.exports = {
  init: init
};
