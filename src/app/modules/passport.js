var passport = require('passport'),
  /*TODO Should adapt config filename to the run environment */
    config = require('../config.' + (process.env.context || 'dev') + '.js'),
    UserModel = require('../models/user'),
    TwitterStrategy  = require('passport-twitter').Strategy;

/*
    This and other fragments borrowed from
    https://github.com/alexbudin/passport-twitter-express4/blob/master/app.js
*/

passport.serializeUser(
    function(user, cb) {
        cb(null, user.twitter.id);
    }
);

passport.deserializeUser(
    function(id, cb) {
        UserModel.find(
            {'twitter.id': id},
            function (err, user) {
                if (err) {
                    return cb(err);
                }
                cb(null, user);
            }
        );
    }
);


if (config.auth.twitter) {
    passport.use(
        new TwitterStrategy(
            config.auth.twitter,
            function(token, tokenSecret, profile, done) {
                process.nextTick(
                    function() {
                        UserModel.findOne(
                            { 'twitter.id' : profile.id },
                            function(err, user) {
                                console.log(
                                    "twitterstrategy.nextTick",
                                    err,
                                    user,
                                    token,
                                    tokenSecret
                                );
                                if (err) {
                                    return done(err);
                                }

                                if (user) {
                                    user.token = token;
                                    user.tokenSecret = tokenSecret
                                } else {
                                    user = new UserModel();
                                    user.twitter = {
                                        id: profile.id,
                                        token: token,
                                        tokenSecret: tokenSecret,
                                        username: profile.username,
                                        displayName: profile.displayName
                                    };

                                    console.log("token:", token, "secret", tokenSecret);
                                }
                                user.save(
                                    function(err) {
                                        if (err) {
                                            throw err;
                                        }
                                        return done(null, user);
                                    }
                                );
                            }
                        );
                    }
                );
            }
        )
    );
}

module.exports = passport;