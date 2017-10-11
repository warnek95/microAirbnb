var _ = require('lodash');
var bcrypt   = require('bcrypt-nodejs');
var LocalStrategy   = require('passport-local').Strategy;
var fs = require('fs');
var jwt = require('jsonwebtoken');
var passportJWT = require("passport-jwt");

var usersFilePath = __dirname + "/../data/users.json"

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'anotherasecretormaybenot';

module.exports = function(passport) {

    passport.use('jwt',new JwtStrategy(jwtOptions, function(jwt_payload, next) {
      console.log('payload received', jwt_payload);
          fs.readFile(usersFilePath,function (err, users) {
            var user = JSON.parse(users)[parseInt(jwt_payload.id)-1];
            if (user) {
              next(null, user);
            } else {
              next(null, false);
            }
          });
    }));

};
