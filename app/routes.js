const moment        = require('moment');
const db            = require('../config/conn.js');
const async         = require("async");
const crypto        = require('crypto');
const nodemailer    = require('nodemailer');

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('home.ejs', {
            user : req.user,
            page:'Home',
            menuId:'home'
        });
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login',
      passport.authenticate('local-login', { failureRedirect: '/login', failureFlash: true }),
      function(req, res, next) {
        if (!req.body.remember_me) { return next(); }

      },
      function(req, res) {
        res.redirect('/');
    });

    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    // app.get('/profile', isLoggedIn, function(req, res) {
    //     res.render('profile.ejs', {
    //         user : req.user
    //     });
    // });

    app.get('/profile', function(req, res) {
        res.render('profile.ejs', {
            user : req.user,
            page:'My Profile',
            menuId:'profile'
        });
    });

    app.get('/reset/:token', function(req, res) {

      let checkToken = "select * from users where resetPasswordToken = '" + req.params.token + "' and resetPasswordExpires >= Now()";

      db.query(checkToken, (err, result) => {
        if (err) return done(err);

        if (result.length <= 0) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('/forgot');
        } else {
          res.render('reset', {
            user: req.user
          });
        }
      });
    });

    app.post('/reset/:token', function(req, res) {
      async.waterfall([
        function(done) {

          let checkToken = "select * from users where resetPasswordToken = '" + req.params.token + "' and resetPasswordExpires >= Now()";

          db.query(checkToken, (err, result) => {
            if (err) return done(err);

            if (result.length <= 0) {
              req.flash('error', 'Password reset token is invalid or has expired.');
              return res.redirect('back');
            } else {
              if (req.body.password != req.body.confirmPassword) {
                return done(null, false, req.flash('error', 'Your passwords do not match.'));
              } else {
                var user = result[0].email;

                bcrypt.hash(password, saltRounds, function(err, hash) {
                  let queryAdd = "update users set password = '" + hash + "',resetPasswordToken = null, resetPasswordExpires = null where email = '" + user + "'";

                  db.query(queryAdd, (err, result) => {
                    if (err) return done(err);

                    return done(null, user);
                  });
                });
              }
            }
          });
        },
        function(user, done) {
          var smtpTransport = nodemailer.createTransport({
                  host: 'a2plcpnl0602.prod.iad2.secureserver.net',
                  port: 465,
                  secure: true,
                  auth: {
                    user: 'automated@cdlchappiness.com',
                    pass: '38{jr7E{4NJ{'
                  }
          });
          var mailOptions = {
            to: user,
            from: 'passwordreset@demo.com',
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
              'This is a confirmation that the password for your account ' + user + ' has just been changed.\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            req.flash('success', 'Success! Your password has been changed.');
            done(err);
          });
        }
      ], function(err) {
        res.redirect('/');
      });
    });

    app.get('/forgot', function(req, res) {
      res.render('forgot', {
        user: req.user,
        message: req.flash('success'),
        errMessage: req.flash('error')
      });
    });

    app.post('/forgot', function(req, res, next) {
      async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {

          let queryLogin = "select * from users where email = '" + req.body.email + "'";

          db.query(queryLogin, (err, result) => {
            if (err) return done(err);

            if (result.length <= 0) {
              req.flash('error', 'No account with that email address exists.');
              return res.redirect('/forgot');
            } else {
              var user = result[0].email;

              let updateTemp = "update users set resetPasswordToken = '" + token + "',resetPasswordExpires = '" + moment().add(12, 'hours').format("YYYY-MM-DD HH:mm:ss") + "' where email = '" + user + "'";

              db.query(updateTemp, (err, result) => {
                if (err) return done(err);

                done(err, token, user);
              });
            }
          });
        },
        function(token, user, done) {
          var smtpTransport = nodemailer.createTransport({
                  host: 'a2plcpnl0602.prod.iad2.secureserver.net',
                  port: 465,
                  secure: true,
                  auth: {
                    user: 'automated@cdlchappiness.com',
                    pass: '38{jr7E{4NJ{'
                  }
          });
          var mailOptions = {
            to: user,
            from: 'passwordreset@demo.com',
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            req.flash('success', 'An e-mail has been sent to ' + user + ' with further instructions.');
            done(err, 'done');
          });
        }
      ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
      });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}
