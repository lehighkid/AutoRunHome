/**
 * Created by admin on 12/1/15.
 */

var format = require('string-format');
var exec = require('child_process').exec;
var settings = require('./../../config/settings');

format.extend(String.prototype);

function sendcode(channelNumber, code, cb) {
  //TODO:  wrap logig in try/catch block
  //TODO:  interpret exec results properly

  var child = exec(settings.lightshowpi.execcmd.format(channelNumber, code));

  // listen for outputs
  child.stdout.on('data', function(data) {
    console.log('info:' + data);
  });

  // listen for errors
  child.stderr.on('data', function(data) {
    console.log('error:' + data);
  });

  // listen for close
  child.on('close', function(code) {
    if (cb) cb(null, code);
  });

}

module.exports = {
  sendcode: sendcode
};
