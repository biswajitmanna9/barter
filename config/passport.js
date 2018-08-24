module.exports = function (passport, FacebookStrategy, FbUsers) {
  var env = process.env['NODE_ENV'] || 'development',
    keys;

  // Set environment
  keys = (env === 'production') ? require('./productionKeys')[env] : require('./keys')[env];
  console.log('ENV used is', env);

  // Callback used to find or create FbUser in the database
  var findOrCreateUser = function (req, accessToken, refreshToken, profile, done) {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    //        console.log('profile',profile);


    req.session.user_access_token = accessToken;
    FbUsers.findOne({
      fbId: profile.id
    }, function (err, oldUser) {
      if (oldUser) {
        done(null, oldUser);
      } else {
        var newUser = new FbUsers({
          fbId: profile.id,
          name: profile.displayName
        }).save(function (err, newUser) {
          if (err) throw err;
          done(null, newUser);
        });
      }
    });
  };

  // Authentication Strategy
  passport.use(new FacebookStrategy({
    clientID: keys.clientID,
    clientSecret: keys.clientSecret,
    callbackURL: keys.URL,
    passReqToCallback: true
  }, findOrCreateUser));

  // Serialized and deserialized methods when got from session
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

};
