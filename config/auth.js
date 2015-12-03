/**
 * Created by admin on 8/11/15.
 */
// expose our config directly to our application using module.exports
module.exports = {

  'nestAuth' : {
    'clientID'      : '35db1bc9-f1be-48a0-b491-acf7e3e2b104', // your App ID
    'clientSecret'  : '0Uv9aD38lJudKdHX1v3BkuaN7', // your App Secret
    'callbackURL'   : 'https://acdrago.dynu.com/auth/nest/callback'
  },

  'facebookAuth' : {
    'clientID'      : '859035200858380',
    'clientSecret'  : '4fb39a698c965be630756e416648fbf0',
    'callbackURL'   : 'https://acdrago.dynu.com/auth/facebook/callback'
  },

  'twitterAuth' : {
    'consumerKey'       : 'hP3yEeitBYWeYbaqtmIU3pv0r',
    'consumerSecret'    : 'psWmL4JeBQosgbmd4QzFGYS8DfoPqGD6kHvQf36E23SQlXBDiY',
    'callbackURL'       : 'https://acdrago.dynu.com/auth/twitter/callback'
  },

  'googleAuth' : {
    'clientID'      : '290049610810-9q7smbh5vrlrhvpf1rm9ldd7ng6ct2la.apps.googleusercontent.com',
    'clientSecret'  : 'xsKsfypIQgPUDfe9qGAtWHS8',
    'callbackURL'   : 'https://acdrago.dynu.com/auth/google/callback'
  }

};
