/**
 * Created by aarondrago on 3/18/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Sensor = mongoose.model('Sensor');

var SensorReadingSchema = new Schema({
  _sensor: { type: Schema.ObjectId, ref: 'Sensor'}
  , changed: { type: Date, default: Date.now}
  , readingtype: String
  , value: Object
  , source: String

});

// search for sensor reading by sensor id
SensorReadingSchema.statics.search = function search(sensorid, cb) {
  return SensorReading.find({'_sensor': sensorid}, {'state': 1, 'changed': 1}).sort({'changed':-1}).limit(1).exec(function (err, sensorreading) {
    if (cb) {
      cb(err, sensorreading);
    }
  });
};

// insert new device state
SensorReadingSchema.statics.create = function create(sensorid, readingtype, value, source, cb) {
  var newsensorreading = new Sensorreading({
    _sensor: sensorid,
    readingtype: readingtype,
    changed: new Date(),
    value: value,
    source: source
  });

  newsensorreading.save(function(err) {
    if (err) return next(err);
    Sensor.updateReading(sensorid, newsensorreading, function(err, updatedsensor){
      if (cb) cb(err, updatedsensor);
    });
  });
};

var Sensorreading = mongoose.model('Sensorreading', SensorReadingSchema);
module.exports = Sensorreading;
