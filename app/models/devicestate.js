/**
 * Created by admin on 8/6/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Device = mongoose.model('Device');

var DevicestateSchema = new Schema({
    _device: { type: Schema.ObjectId, ref: 'Device'}
  , changed: { type: Date, default: Date.now}
  , state: Boolean
  , notify: Boolean
  , source: String

});

// search for device state by device id
DevicestateSchema.statics.search = function search(deviceid, cb) {
  return Devicestate.find({'_device': deviceid}, {'state': 1, 'changed': 1}).sort({'changed':-1}).limit(1).exec(function (err, devicestate) {
    if (cb) {
      cb(err, devicestate);
    }
  });
};

// insert new device state
DevicestateSchema.statics.create = function create(deviceid, state, notify, source, cb) {
  var newdevicestate = new Devicestate({
    _device: deviceid,
    state: state,
    changed: new Date(),
    notify: notify,
    source: source
  });

  newdevicestate.save(function(err) {
    if (err) return next(err);
    Device.updateState(deviceid, state, newdevicestate.changed, notify, source, function(err, updateddevice){
      if (cb) cb(err, updateddevice);
    });
  });
};

var Devicestate = mongoose.model('Devicestate', DevicestateSchema);
module.exports = Devicestate;
