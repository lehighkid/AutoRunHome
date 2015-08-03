/**
 * Created by admin on 7/30/15.
 */
var gpio = require('onoff').Gpio;

// creates Door Down pin instance with direction "in"

module.exports.init = function(endpoint, socket){

  var doorDownIf = new gpio(22, 'in', 'both', {debounceTimeout: 300});
  var doorOpenIf = new gpio(25, 'in', 'both', {debounceTimeout: 300});

  doorDownIf.watch(function(err, value) {
    if (err) return next(err);
    console.log("c-" + value);
    //endpoint.emit('gDoorDown', value);
  });

  doorOpenIf.watch(function(err, value) {
    if (err) return next(err);
    console.log("o-" + value);
    //endpoint.emit('gDoorOpen', value);
  });

};
