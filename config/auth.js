/**
 * Created by admin on 8/11/15.
 */
// expose our config directly to our application using module.exports
module.exports = {

  'nestAuth' : {
    'clientID'      : '', // your App ID
    'clientSecret'  : '', // your App Secret
    'callbackURL'   : 'https://.com/auth/nest/callback'
  },

  'facebookAuth' : {
    'clientID'      : '',
    'clientSecret'  : '',
    'callbackURL'   : 'https://.com/auth/facebook/callback'
  },

  'twitterAuth' : {
    'consumerKey'       : '',
    'consumerSecret'    : '',
    'callbackURL'       : 'https://.com/auth/twitter/callback'
  },

  'googleAuth' : {
    'clientID'      : '',
    'clientSecret'  : '',
    'callbackURL'   : 'https://.com/auth/google/callback'
  }

};
