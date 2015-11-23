/**
 * Created by admin on 8/8/15.
 */
var exec = require('child_process').exec;
var settings = require('./../../config/settings');

function show(cb) {
  //TODO:  wrap logging in try/catch block
  //TODO:  interpret exec results properly

  var child = exec(settings.nest.execcmd);

  // listen for outputs
  child.stdout.on('data', function(data) {
    if(cb) cb(null, data);
  });

  // listen for errors
  child.stderr.on('data', function(data) {
    console.log('error:' + data);
  });

  // listen for close
  child.on('close', function(code) {
    //if (cb) cb(null, code);
  });

}

module.exports = {
  show: show
};
