/**
 * Created by admin on 7/31/15.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var GaragedoorSchema = new Schema({
  name: String
  , description: String
  , state: Boolean
  , statechanged: Date
  , remotenum: Number
  , inuse: Boolean
  , sortorder: Number
  , webcamurl: String
  , haswebcam: Boolean
});

GaragedoorSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Garagedoor', GaragedoorSchema);
