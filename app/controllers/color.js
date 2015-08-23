/**
 * Created by admin on 8/23/15.
 */
var express = require('express');
var router = express.Router();

var _endpoint;

function init (app, passport) {
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
