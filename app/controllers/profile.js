/**
 * Created by admin on 8/9/15.
 */
var express = require('express');
var router = express.Router();
var auth = require('./../../config/passport');

function init (app, passport) {
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
