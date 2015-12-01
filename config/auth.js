/**
 * Created by admin on 8/11/15.
 */
// expose our config directly to our application using module.exports
module.exports = {

  'nestAuth' : {
    'clientID'      : 'yourclientid', // your App ID
    'clientSecret'  : 'yoursecret', // your App Secret
    'callbackURL'   : 'https://your.server/auth/nest/callback'
  },

  'facebookAuth' : {
    'clientID'      : 'yourclientid',
    'clientSecret'  : 'yoursecret',
    'callbackURL'   : 'https://your.server/auth/facebook/callback'
  },

  'twitterAuth' : {
    'consumerKey'       : 'yourclientid',
    'consumerSecret'    : 'yoursecret',
    'callbackURL'       : 'https://your.server/auth/twitter/callback'
  },

  'googleAuth' : {
    'clientID'      : 'yourclientid',
    'clientSecret'  : 'yoursecret',
    'callbackURL'   : 'https://your.server/auth/google/callback'
  }

};
