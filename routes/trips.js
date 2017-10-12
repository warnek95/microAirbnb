var _ = require('lodash');
var fs = require('fs');
var moment = require('moment');
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
      var start = moment(parseInt(req.body.start))
      var end = moment(parseInt(req.body.end))
      var reservationsParsed = JSON.parse(reservations);
      var indexOwn = _.findIndex(reservationsParsed, function(o) {
        return (o.trip_id == req.body.trip_id && o.user_id == req.user.id)
      })
      var indexOthers = _.findIndex(reservationsParsed, function(o) {
        var savedStart = moment(o.start)
        var savedEnd = moment(o.end)
        return (start.isSameOrBefore(savedStart) && end.isSameOrAfter(savedStart)) ||
          (start.isSameOrBefore(savedEnd) && end.isSameOrAfter(savedEnd)) ||
          (start.isSameOrAfter(savedStart) && end.isSameOrBefore(savedEnd))
      })
      console.log(indexOthers);
      if(indexOwn < 0 && indexOthers < 0) {
        reservationsParsed.push({
          trip_id : req.body.trip_id,
          user_id : req.user.id,
          start : start,
          end : end
        })
        fs.writeFile(reservationsFilePath, JSON.stringify(reservationsParsed), 'utf8', function(err, data){
          res.json({
            "status" : "OK",
            "message": "Reservation effectué."
          });
        });
      } else if(indexOwn >= 0) {
        res.status(400).json({
          "status" : "Bad request",
          "message": "Vous avez déjà fais une réservation pour cette destination."
        });
      } else if(indexOthers >= 0) {
        res.status(400).json({
          "status" : "Bad request",
          "message": "Une réservation a déjà été effectuée pour cette destination à cette période."
        });
      }
    });
  });
}
