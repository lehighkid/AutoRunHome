/**
 * Created by admin on 8/6/15.
 */
var exec = require('child_process').exec;

module.exports.sendcode = function sendcode(code, cb) {
  //TODO:  wrap logig in try/catch block
  //TODO:  interpret exec results properly

  var child = exec('sudo /home/pi/commands/rfoutlet/codesend ' + code);

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
    //console.log('result:' + code);
    if (cb) cb(null, code);
  });

};
