module.exports = function(app, passport) {
  app.get('/', function(req, res, next) {
    res.render('index', {
      title: 'The micro Airbnb',
      user: req.user
    });
  });
}
