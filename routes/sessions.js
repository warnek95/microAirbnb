var _ = require('lodash');
var bcrypt   = require('bcrypt-nodejs');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var usersFilePath = __dirname + "/../data/users.json"

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'anotherasecretormaybenot';

module.exports = function(app, passport) {
  app.post('/sessions',  function(req, res, next) {
    if (!req.param('username') || !req.param('password')) {
      res.status(400).send({
        message : "missing required parameters"
      })
    } else {
      fs.readFile(usersFilePath,function (err, users) {
          var array = JSON.parse(users);
          var index = _.findIndex(array, function(o) { return o.username == req.param('username'); });
          if (err) {
            res.status(500).send({
              message : err
            })
          }

          if (index < 0) {
            res.status(401).send({
              message : 'No user found.'
            })
          }

          var user = array[index];

          if (!bcrypt.compareSync(req.param('password'), user.password)){
            res.status(401).send({
              message : 'Wrong password.'
            })
          }

          var payload = {id: user.id};
          var token = jwt.sign(payload, jwtOptions.secretOrKey);
          res.json({message: "ok", token: token});
      });
    }
  })
}
