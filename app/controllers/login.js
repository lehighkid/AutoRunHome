/**
 * Created by admin on 8/9/15.
 */
var express = require('express');
var router = express.Router();

var _passport = require('passport');

function init (app, passport) {
  _passport = passport;
  app.use('/login', router);
}

// show the login form
router.get('/', function(req, res) {
  res.render('login', { message: req.flash('loginMessage') });
});

// process the login form
router.post('/', _passport.authenticate('local-login', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

module.exports = {
  init: init
};
