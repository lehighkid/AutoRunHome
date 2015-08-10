/**
 * Created by admin on 8/9/15.
 */
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

  local            : {
    email        : String,
    password     : String
  },
  facebook         : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  },
  twitter          : {
    id           : String,
    token        : String,
    displayName  : String,
    username     : String
  },
  google           : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password, next) {
  return bcrypt.hash(password, bcrypt.genSaltSync(8), null, next);
};

// checking if password is valid
userSchema.methods.validPassword = function(password, next) {
  bcrypt.compare(password, this.local.password, next);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
