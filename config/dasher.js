/**
 * Created by admin on 12/2/15.
 */
var settings = require('./settings');
var dash_button = require('node-dash-button');
var deviceOperate = require('./../app/controllers/deviceoperate');

var _endpoint;
var _lastDash = {
  dashid: "",
  dashtime: Date.now(),
  clicknum: 0
};

var _lights = [
  "565f8613db96a301c4cdb54a", // all lights (lightshowpi)
  //"565e28ad17a67eababaeef1e",  // xmas tree (lightshowpi)
  //"565fc12f65b2fc916fbaccf2"    // xmas tree (gpio)
];

function updateLastDash(dashid, dashtime){
  _lastDash.dashid = dashid;
  _lastDash.dashtime = dashtime;
  _lastDash.clicknum++;
}

function respond(endpoint, socket){
  _endpoint = endpoint;

  var dash = dash_button(settings.dasher.dashes);

  dash.on("detected", function (dash_id){
    // debounce button click
    if (Date.now() - _lastDash.dashtime > 5000) {

      // lookup device id
      var data = {
        deviceid: _lights[(_lastDash.clicknum + 1) % _lights.length]
      };

      // operate device
      deviceOperate.deviceoperate(data, function(err, resp){
        if (err) return console.log(err);
      });

      // maintain session log of dashes for comparison
      updateLastDash(dash_id, Date.now());
      //console.log("Found: ", dash_id, "clicknum: ", _lastDash.clicknum, " last found: ", _lastDash.dashid, " @ ", _lastDash.dashtime);
    }
  });
}

module.exports = {
  respond: respond
};
