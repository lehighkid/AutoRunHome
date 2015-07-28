var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CodeSchema = new Schema({
	  oncode: Number
	, offcode: Number
});

var OutletSchema = new Schema({
	  name: String
	, type: String
  	, oncode: Number
	, offcode: Number
	, state: Boolean
});

OutletSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Outlet', OutletSchema);
