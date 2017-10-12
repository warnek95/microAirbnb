var sgMail = require('@sendgrid/mail');

sgMail.setApiKey("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");

module.exports = function(app, passport) {
  app.get('/', function(req, res, next) {
    res.render('index', {
      title: 'The micro Airbnb',
      user: req.user
    });
  });
  app.post('/mail', function(req, res, next) {
    var msg = {

      to: req.body.mail,

      from: 'admin@microAirbnb.com',

      subject: 'Sent from microAirbnb',

      text: 'Bonjour !!'


    };

    sgMail.send(msg);
    res.json({
      status: 'OK'
    })
  });
}
