/**
 * Created by admin on 7/29/15.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var RfdeviceSchema = new Schema({
    name: String
  , description: String
  , type: String
  , codes: [Number]
  , state: Boolean
  , statechanged: Date
  , remotenum: Number
  , inuse: Boolean
});

RfdeviceSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Rfdevice', RfdeviceSchema);
