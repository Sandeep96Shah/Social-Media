//acquiring the passport ibrary
const passport = require("passport");
const env = require('./environment');
//this is to get the strategy
const JWTStrategy = require("passport-jwt").Strategy;

//this is used to bget the library to extract the jwt from the header
const ExtractJWT = require("passport-jwt").ExtractJwt;

const User = require("../models/user");

let opts = {
    //for where the jwt request will be received
    //header has a key called auth and inside auth Bearer is a key where the token(JWT) is present
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  //this id for the  decryption
  secretOrKey: env.jwt_secret,
};

passport.use(
  new JWTStrategy(opts, function (jwtPayload, done) {
    User.findById(jwtPayload._id, function (err, user) {
      if (err) {
        console.log("error in finding the user from JWT", err);
        return;
      }

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);
module.exports = passport;