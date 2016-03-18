/**
 * Created by aarondrago on 3/18/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SensorSchema = new Schema({
  name: String
  , description: String
  , type: String
  , subtype: String
  , typeName: String
  , rpi: String
  , controllerId: String
  , inuse: Boolean
  , sortorder: Number
  , latestReading: Object
});

// list all sensors
SensorSchema.statics.list = function list(cb) {
  return Sensor.find({}, function (err, sensors) {
    if (cb) {
      cb(err, sensors);
    }
  });
};

// search all sensors by id
SensorSchema.statics.search = function search(id, cb) {
  return Sensor.findById(id, function (err, sensor) {
    if (cb) {
      cb(err, sensor);
    }
  });
};

// update sensor reading by id
SensorSchema.statics.updateReading = function (id, reading, cb){
  Sensor.findById(id, function (err, sensor) {
    if (err) return next(err);
    sensor.latestReading = JSON.stringify(reading);
    sensor.save(function(err) {
      if (err) return next(err);
      if (cb) {
        cb(err, sensor);
      }
    });
  });
};

// create new sensor
SensorSchema.statics.create = function create(name, description, type, subtype, typename, inuse, sortorder, rpi, controllerid, cb) {
  var newSensor = new Sensor ({
      name: name
    , description: description
    , type: type
    , subtype: subtype
    , typeName: typename
    , inuse: inuse
    , sortorder: sortorder
    , rpi: rpi
    , controllerId: controllerid
  });
  newSensor.save(function(err) {
    if (cb) cb(err, newSensor);
  });
};

//TODO: Research why remove functions do not limit to 1 document
// delete sensor by id
SensorSchema.statics.delete = function remove(id, cb) {
  return Sensor.findByIdAndRemove(id, function (err) {
    if (cb) {
      cb(err, string.json({'message': 'Sensor: ' + id + ' deleted'}));
    }
  });
};

var Sensor = mongoose.model('Sensor', SensorSchema);
module.exports = Sensor;
