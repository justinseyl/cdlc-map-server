var LocalStrategy       = require('passport-local').Strategy;
var RememberMeStrategy  = require('passport-remember-me').Strategy;
const bcrypt            = require('bcrypt');
const saltRounds        = 10;
const moment            = require('moment');
var db                  = require('./conn.js');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
  		db.query("select * from users where email = '" + user.email + "'", (err, result) => {
          done(err, result[0]);
      });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
      let queryLogin = "select * from users where email = '" + email + "'";

      db.query(queryLogin, (err, result) => {
        if (err) return done(err);

        if (result.length <= 0) {
          return done(null, false, req.flash('loginMessage', 'No User Found.'));
        } else {
          if (result[0].password) {
            bcrypt.compare(password, result[0].password, function(err, res) {
              if(res) {

                return done(null, result[0]);
              } else {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong Password.'));
              }
            });
          }
        }
      });

    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        process.nextTick(function() {

          let query = "select * from users where email = '" + email + "'";

          db.query(query, (err, result) => {
            if (err) return done(err);

            if (result.length > 0) {
              return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
              if (req.body.password != req.body.confirmPassword) {
                return done(null, false, req.flash('signupMessage', 'Your passwords do not match.'));
              } else {
                bcrypt.hash(password, saltRounds, function(err, hash) {
                  let queryAdd = "insert into users (email,password,updated_at,first,last,state,status) values ('" + email + "','" + hash + "','" + moment().format("YYYY-MM-DD HH:mm:ss") + "','" + req.body.first + "','" + req.body.last + "','" + req.body.state + "','active')";

                  db.query(queryAdd, (err, result) => {
                    if (err) return done(err);

                    let q = "select * from users where email = '" + email + "'";
                    db.query(q, (err, res) => {
                      if (err) return done(err);
                      return done(null, res[0]);
                    });

                  });
                });
              }
            }
          });
        });
    }));

};
