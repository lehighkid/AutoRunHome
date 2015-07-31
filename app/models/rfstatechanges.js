/**
 * Created by admin on 7/31/15.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var rfdevice = require('./rfdevices');

var RfstatechangeSchema = new Schema({
  _rfdevice: { type: Schema.ObjectId, ref: 'Rfdevice'}
  , changed: { type: Date, default: Date.now}
  , state: Boolean

});

RfstatechangeSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Rfstatechange', RfstatechangeSchema);
