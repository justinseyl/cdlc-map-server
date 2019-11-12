const express       = require('express');
const app           = express();
const passport      = require('passport');
const flash         = require('connect-flash');
const path          = require('path');
const morgan        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const session       = require('express-session');
const Q             = require('q');

var port            = process.env.PORT || 8080;

require('./config/passport')(passport);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(flash());
app.use(express.static(__dirname + '/public'))

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret: 'roadrecon' }));
app.use(passport.initialize());
app.use(passport.session());

require('./app/routes.js')(app, passport);

app.listen(port,'0.0.0.0', () => console.log(`CDLC app listening on port ${port}!`))
