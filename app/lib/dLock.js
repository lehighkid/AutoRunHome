/**
 * Created by admin on 8/12/15.
 */
var format = require('string-format');
var http = require('http');

format.extend(String.prototype);

function operate(code, cb ) {
  var options = {
    host: '10.0.1.4',
    port: 8083,
    path: 'ZWaveAPI/Run/devices[5].instances[0].commandClasses[98].Set({0})'.format(code)
  };

  var url = 'http://10.0.1.4:8083/ZWaveAPI/Run/devices[5].instances[0].commandClasses[98].Set({0})'.format(code);

  http.request(url, function(response){
    var result = response.statusCode;

    if (result != 200){
      if (cb) return cb(result, response);
    }

    if (cb) return cb(null, response);

  }).end();
}

module.exports = {
  operate: operate
};

//http://10.0.1.4:8083/ZWaveAPI/Run/devices[5].instances[0].commandClasses[98].Set(0)   //unlock
//http://10.0.1.4:8083/ZWaveAPI/Run/devices[5].instances[0].commandClasses[98].Set(255) //lock
//http://10.0.1.4:8083/ZWaveAPI/Run/devices[5].instances[0].commandClasses[98].Get()    //state request
//http://10.0.1.4:8083//ZWaveAPI/Run/devices[2].DoorLock.data.mode.value                //state value
