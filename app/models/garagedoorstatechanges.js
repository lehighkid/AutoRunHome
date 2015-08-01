/**
 * Created by admin on 7/31/15.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var GaragedoorstatechangeSchema = new Schema({
    _garagedoor: { type: Schema.ObjectId, ref: 'garagedoor'}
  , changed: { type: Date, default: Date.now}
  , state: Boolean

});

GaragedoorstatechangeSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Garagedoorstatechange', GaragedoorstatechangeSchema);
