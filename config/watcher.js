/**
 * Created by admin on 7/30/15.
 */
var gpio = require('onoff').Gpio;

// creates Door Down pin instance with direction "in"

module.exports.init = function(endpoint, socket){

  var doorDownIf = new gpio(22, 'in', 'falling', {debounceTimeout: 2500});
  var doorOpenIf = new gpio(25, 'in', 'falling', {debounceTimeout: 2500});

  doorDownIf.watch(function(err, value) {
    if (err) return next(err);
    console.log("c");
    //endpoint.emit('gDoorDown', value);
  });

  doorOpenIf.watch(function(err, value) {
    if (err) return next(err);
    console.log("o");
    //endpoint.emit('gDoorOpen', value);
  });

};
