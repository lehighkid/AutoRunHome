/**
 * Created by admin on 8/12/15.
 */
var format = require('string-format');
var http = require('http');
var settings = require('./../../config/settings');
var url = require( "url" );

format.extend(String.prototype);

function operate(code, cb ) {
  var zurl = settings.razberry.url.format(code);
  var zparsedurl = url.parse(zurl);

  var username = settings.razberry.user;
  var password = settings.razberry.pass;
  var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

  var options = {
    hostname: zparsedurl.hostname,
    port: zparsedurl.port,
    path: zparsedurl.pathname,
    method: "GET",
    headers: {
      authorization: auth
    }
  };

  http.request(options, function(response){
    var result = response.statusCode;

    if (result != 200){
      if (cb) return cb(result, response);
    }

    if (cb) return cb(null, response);

  }).end();
}

module.exports = {
  operate: operate
};

