/**
 * Created by admin on 8/8/15.
 */
var exec = require('child_process').exec;

function show(cb) {
  //TODO:  wrap logig in try/catch block
  //TODO:  interpret exec results properly

  var child = exec('nest --conf /home/pi/commands/nest.conf temp');

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
