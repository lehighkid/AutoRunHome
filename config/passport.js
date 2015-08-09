/**
 * Created by admin on 8/9/15.
 */
var passport = require('passport');
var NestStrategy = require('passport-nest').Strategy;
var format = require('string-format');

format.extend(String.prototype);

passport.use(new NestStrategy({
    clientID: process.env.NEST_ID,
    clientSecret: process.env.NEST_SECRET,
    tokenURL: 'https://api.home.nest.com/oauth2/access_token?client_id={0}&code=AUTHORIZATION_CODE&client_secret={1}&grant_type=authorization_code'.format(process.env.NEST_ID, process.env.NEST_SECRET), //'https://api.home.testc.nestlabs.com/oauth2/access_token',
    authorizationURL: 'https://home.nest.com/login/oauth2?client_id={0}&state=STATE'.format(process.env.NEST_ID) //'https://home.testc.nestlabs.com/login/oauth2'
  }
));

module.exports = {
  init: function(app) {
    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user, done) {
      done(null, user);
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/auth/nest', passport.authenticate('nest'));
    app.get('/auth/nest/callback',
      passport.authenticate('nest', {
        successRedirect: '/',
        failureRedirect: '/auth/nest'
      }),
      function (req, res) {

      }
    );
  },
  ensureAuthenticated: (function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/auth/nest')
  })
};
