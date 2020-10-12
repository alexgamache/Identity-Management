const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, cb) {
    console.log(user.id)
    cb(null, user);
});
  
  passport.deserializeUser(function(obj, cb) {
    console.log('No user found.')
    cb(null, obj);
});

passport.use(new GoogleStrategy({
    // clientID: "712277424864-1nrsmqtojur275air8lsc0pqalll7jqj.apps.googleusercontent.com", //Web Client (uncomment this line to test on web server)
    clientID: "712277424864-ueco7jolgtd6p43fdlfdpokqsotajsvr.apps.googleusercontent.com", //Android Client 
    clientSecret: "_ti_jhR1ClKvmLE4TiuXOp-d",
    callbackURL: "http://localhost:80/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log("google based auth called");
      //console.log(profile);
    return done(null, profile);
  }
));

