/**
 * Created by admin on 1/3/16.
 */
var format = require('string-format');
var settings = require('./../../config/settings');
var SamsungRemote = require('samsung-remote');

function operate(device, cmd, cb) {
  var _remote = new SamsungRemote({
    ip: device.ipadd  //replace w/ device.ip -- need to update device model
  });
  // check if TV is alive (ping)
  _remote.isAlive(function (err, result) {
    if (err) {
      if (cb)
        cb(err, result);
    } else {
      _remote.send(cmd, function (err, result) {
        if (err) {
          if (cb)
            cb(err, result);
        } else {
          if (cb)
            cb(null, result);
          // command has been successfully transmitted to your tv
        }
      });
    }
  });
}

module.exports = {
  operate: operate
};
