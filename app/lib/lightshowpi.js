/**
 * Created by admin on 12/1/15.
 */

var format = require('string-format');
var exec = require('child_process').exec;
var settings = require('./../../config/settings');

format.extend(String.prototype);

function operate(channelNumber, code, cmd, cb) {
  var cmds = {
    toggle: settings.lightshowpi.execcmd.format(channelNumber, code),
    music: settings.lightshowpi.execcmdM.format((code==="on") ? "start" : "stop")
  };

  try {
    console.log(cmds[cmd]);
    exec(cmds[cmd]);
  }
  catch (err) {
    if (cb) cb(err, -1);
  }
  finally {
    if (cb) cb('', 0);
  }
}

module.exports = {
  operate: operate
};
