/**
 * Created by admin on 8/9/15.
 */
var express = require('express');
var router = express.Router();

function init (app, passport) {
  app.use('/', router);
}

router.get('/', function (req, res, next) {
    res.render('index');
  });

module.exports = {
  init: init
};
