const passport = require('passport');
const InstagramStrategy = require('passport-instagram').Strategy;

var INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID
var INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET 


  passport.serializeUser(function(user, cb) {
     console.log(user.id)
     cb(null, user);
 });

    passport.deserializeUser(function(obj, cb) {
     console.log('No user found.')
     cb(null, obj);
 });

  passport.use(new InstagramStrategy({
     clientID: INSTAGRAM_CLIENT_ID,
     clientSecret: INSTAGRAM_CLIENT_SECRET,
     callbackURL: "http://localhost:80/auth/instagram/callback"
   },
   function(accessToken, refreshToken, profile, done) {
       console.log("instagram based auth called");
       //console.log(profile);
     return done(null, profile);
   }
 )); 