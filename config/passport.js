/**
 * Created by admin on 8/9/15.
 */
var passport = require('passport');
var format = require('string-format');
var NestStrategy = require('passport-nest').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

format.extend(String.prototype);

passport.use('nest', new NestStrategy({
    clientID: process.env.NEST_ID,
    clientSecret: process.env.NEST_SECRET,
    tokenURL: 'https://api.home.nest.com/oauth2/access_token?client_id={0}&code=AUTHORIZATION_CODE&client_secret={1}&grant_type=authorization_code'.format(process.env.NEST_ID, process.env.NEST_SECRET), //'https://api.home.testc.nestlabs.com/oauth2/access_token',
    authorizationURL: 'https://home.nest.com/login/oauth2?client_id={0}&state=STATE'.format(process.env.NEST_ID) //'https://home.testc.nestlabs.com/login/oauth2'
  }
));

passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {

    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.email' : email }, function(err, user) {
        // if there are any errors, return the error
        if (err)
          return done(err);

        // check to see if theres already a user with that email
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {

          // if there is no user with that email
          // create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.local.email = email;
          newUser.generateHash(password, function(err, hash){
            if (err) return done(err);
            newUser.local.passord = hash;

            // save the user
            newUser.save(function(err) {
              if (err) return done(err);
              return done(null, newUser);
            });
          });
        }
      });
    });
  })
);

passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) { // callback with email and password from our form

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'local.email' :  email }, function(err, user) {
      // if there are any errors, return the error before anything else
      if (err)
        return done(err);

      // if no user is found, return the message
      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

      // if the user is found but the password is wrong
      user.validPassword(password, function(err, valid){
          if (err) return done(err);
          if (!valid)
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
        });

      // all is well, return successful user
      return done(null, user);
    });
  }
));

module.exports = {
  init: function(app) {
    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });

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
    res.redirect('/')
  })
};
