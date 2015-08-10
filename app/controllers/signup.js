/**
 * Created by admin on 8/9/15.
 */
var express = require('express');
var router = express.Router();

var _passport = require('passport');

function init (app, passport) {
  _passport = passport;
  app.use('/signup', router);
}

router.get('/', function (req, res, next) {
    res.render('signup');
  });

router.post('/', _passport.authenticate('local-signup', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/signup', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

module.exports = {
  init: init
};
