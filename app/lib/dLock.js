/**
 * Created by admin on 8/12/15.
 */
var format = require('string-format');
var http = require('http');
var settings = require('./../../config/settings');

format.extend(String.prototype);

function operate(code, cb ) {
  var options = {
    host: settings.razberry.zboxip,
    port: settings.razberry.zboxport,
    path: settings.razberry.zpath.format(code)
  };

  var url = 'http://{0}:{1}/{2}'.format(options.host, options.port, options.path);

  http.request(url, function(response){
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

