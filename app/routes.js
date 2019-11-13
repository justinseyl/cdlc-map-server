const moment        = require('moment');
const db            = require('../config/conn.js');
const async         = require("async");
const crypto        = require('crypto');
const nodemailer    = require('nodemailer');
const uuidv4 = require('uuid/v4');

module.exports = function(app, passport) {

    app.get('/', isLoggedIn, function(req, res) {
      let query = "select state,count(*) as num from tr_area where status = 'active' group by 1 order by case when state = '" + req.user.state + "' then 0 else state end";
      db.query(query, (err, result) => {
        if (err) throw err;

        res.render('home.ejs', {
              user : req.user,
              page:'Home',
              menuId:'home',
              statecode: req.user.state,
              groupstate: result
        });
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

    app.post('/signup', passport.authenticate('local-signup', { failureRedirect : '/signup', failureFlash : true }),
    function(req, res) {
      res.redirect('/');
    });

    app.get('/profile', function(req, res) {
        res.render('profile.ejs', {
            user : req.user,
            page:'My Profile',
            menuId:'profile'
        });
    });

    app.get('/events', isLoggedIn, function(req, res) {
      let query = "select description, state, county, date_format(created_at, '%m/%d/%y') as created, date_format(created_at, '%h:%i %p') as ctime, case when created_at >= date_sub(Now(), interval 1 day) then 'new' end as isnew from tr_area where status = 'active' and userid = '" + req.user.email + "' order by created_at desc";
      db.query(query, (err, result) => {
        if (err) throw err;

        res.render('events.ejs', {
            user : req.user,
            page:'My Events',
            menuId:'events',
            event: result
        });
      });
    });

    app.post('/submitNewTrouble', function(req, res, next){
      let query = "insert into tr_area (id,state,county,description,created_at,status,userid) values ('" + uuidv4() + "','" + req.body.state + "','" + req.body.county + "','" + req.body.description + "','" + moment().format("YYYY-MM-DD HH:mm:ss") + "','active','" + req.user.email + "')";
      db.query(query, (err, result) => {
        if (err) throw err;

        res.redirect('county_table?state=' + req.body.state + '&county=' + req.body.county + '');
      });
   });

   app.get('/getCountyByState', function(req, res, next){
     let state = req.query.state;
     let query = "select Upper(county) as county,count(*) as num from tr_area where status = 'active' and state = '" + state + "' group by 1 order by 1";

     db.query(query, (err, rescty) => {
       if (err) throw err;

       res.send(rescty);
     });
   });

    app.get('/county_table', function(req, res) {
      let query = "select description, state, county, date_format(created_at, '%m/%d/%y') as created, date_format(created_at, '%h:%i %p') as ctime, case when created_at >= date_sub(Now(), interval 1 day) then 'new' end as isnew from tr_area where status = 'active' and state = '" + req.query.state + "' and county = '" + req.query.county + "' order by created_at desc";
      db.query(query, (err, result) => {
        if (err) throw err;

        res.render('county_table.ejs', {
            user : req.user,
            page:'Home',
            menuId:'home',
            formdata: result
        });
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
