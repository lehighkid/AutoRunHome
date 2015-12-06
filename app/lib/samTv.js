/**
 * Created by admin on 12/4/15.
 */
var SamsungRemote = require('samsung-remote');
var settings = require('./../../config/settings');

function send(cmd, cb) {

  var remote = new SamsungRemote({
    ip: settings.samtv.tvip // required: IP address of your Samsung Smart TV
  });

  // replace w/ cmd parameter for button access
  remote.send('KEY_VOLUP', function callback(err) {
    if (err) {
      if (cb) cb(err, -1);
    } else {
      // command has been successfully transmitted to your tv
      if (cb) cb(err, 0);
    }
  });

  // check if TV is alive (ping)
  remote.isAlive(function(err) {
    if (err) {
      console.log('TV is offline');
      if (cb) cb(err, -1);
    } else {
      console.log('TV is ALIVE!');
      if (cb) cb(err, 0);
    }
  });

}

module.exports = {
  send: send
};
