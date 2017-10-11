var _ = require('lodash');
var fs = require('fs');
var tripsFilePath = __dirname + "/../data/trips.json"
var reservationsFilePath = __dirname + "/../data/reservations.json"
module.exports = function(app, passport) {
  app.get('/trips', function (req, res) {
    res.render('results');
  });

  app.get('/trips/json', function (req, res) {

    fs.readFile(tripsFilePath,function (err, trips) {
      fs.readFile(reservationsFilePath,function (err, reservations) {
        var tripsParsed = JSON.parse(trips);
        var userReservations = _.filter(JSON.parse(reservations), function(o) { return o.user_id == req.user.id; });
        var query = req.query.q

        for (var i = 0; i < tripsParsed.length; i++) {
          tripsParsed[i].reserved = !(_.findIndex(userReservations, function(o) {
            return o.trip_id == tripsParsed[i].id
          }) < 0);
        }

        res.json({
          trips: !query ? tripsParsed : _.filter(tripsParsed, function(o) {
            return (o.name.toLowerCase().indexOf(query.toLowerCase()) >= 0
             || o.description.toLowerCase().indexOf(query.toLowerCase()) >= 0)
          }),
          user: req.user
        });
      });
    });
  });

  app.post('/trips', function (req, res) {
    fs.readFile(reservationsFilePath,function (err, reservations) {
      var reservationsParsed = JSON.parse(reservations);
      var index = _.findIndex(reservationsParsed, function(o) {
        return o.trip_id == req.body.trip_id && o.user_id == req.user.id
      })
      if(index < 0) {
        reservationsParsed.push({
          trip_id : req.body.trip_id,
          user_id : req.user.id
        })
        fs.writeFile(reservationsFilePath, JSON.stringify(reservationsParsed), 'utf8', function(err, data){
          res.json({
            "status" : "OK",
            "message": "Reservation effectué."
          });
        });
      } else {
        res.json({
          "status" : "OK",
          "message": "Reservation déjà effectué."
        });
      }
    });
  });
}
