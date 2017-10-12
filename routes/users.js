var _ = require('lodash');
var fs = require('fs');
var moment = require('moment');
var tripsFilePath = __dirname + "/../data/trips.json"
var reservationsFilePath = __dirname + "/../data/reservations.json"

module.exports = function(app, passport) {
  app.get('/user', function (req, res) {
    res.render('profile');
  });

  app.get('/user/json', function (req, res) {
    moment.locale('fr');
    fs.readFile(tripsFilePath,function (err, trips) {
      fs.readFile(reservationsFilePath,function (err, reservations) {
        var userReservations = _.filter(JSON.parse(reservations), function(o) { return o.user_id == req.user.id; });
        var tripsParsed = JSON.parse(trips);

        for (var i = 0; i < userReservations.length; i++) {
          userReservations[i].trip = _.find(tripsParsed, function(o) { return o.id == userReservations[i].trip_id });
          userReservations[i].start = moment(userReservations[i].start).format('LL');
          userReservations[i].end = moment(userReservations[i].end).format('LL');
        }
        res.json({
          reservations : userReservations,
          user : req.user
        })
      })
    })
  });
}
