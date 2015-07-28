var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CommandSchema = new Schema({
	  name: String
	, type: String
  	, path: String
	, language: String
	, requiressudo: Boolean
});

CommandSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Command', CommandSchema);
