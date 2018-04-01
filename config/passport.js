var mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , VKStrategy = require('passport-vkontakte').Strategy

  , User = mongoose.model('User')


module.exports = function (passport, config) {
  // require('./initializer')

  // serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  });

  passport.deserializeUser(function (id, done) {
    User.findOne({_id: id}, function (err, user) {
      done(null, user)
    });
  });

  // use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function (email, password, done) {
      User.findOne({email: email}, function (err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false, {message: 'Unknown user'})
        }
        if (!user.authenticate(password)) {
          return done(null, false, {message: 'Invalid password'})
        }
        return done(null, user)
      })
    }
  ))

  // use facebook strategy
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID
      , clientSecret: config.facebook.clientSecret
      , callbackURL: config.facebook.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile)
      User.findOne({'fbId': profile.id}, function (err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          user = new User({
            fbId: profile.id
            , name: profile.displayName
            , email: 'paulkotov@email.com'
            , username: profile.username
            , provider: 'facebook'
            , facebook: profile._json
            , avatar: "http://graph.facebook.com/" + profile.id + "/picture?type=square"
          })
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        }
        else {
          return done(err, user)
        }
      })
    }
  ))

  // use google strategy
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({'gId': profile.id}, function (err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          // make a new google profile without key start with $
          var new_profile = {};
          new_profile.id = profile.id;
          new_profile.displayName = profile.displayName;
          new_profile.emails = profile.emails;
          user = new User({
            gId: profile.id
            , name: profile.displayName
            , email: profile.emails[0].value
            , username: profile.username
            , provider: 'google'
            , google: new_profile._json
          })
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        } else {
          return done(err, user)
        }
      })
    }
  ));

  passport.use('vk', new VKStrategy({
      clientID: config.vk.clientID,
      clientSecret: config.vk.clientSecret,
      callbackURL: config.vk.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile)
      User.findOne({vkId: profile.id}, function (err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          user = new User({
            vkId: profile.id
            , name: profile.displayName
            , username: profile.username
            , provider: 'vkontakte'
          })
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        } else {
          return done(err, user)
        }
      })
    }
  ));
}
