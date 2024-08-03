
'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var app = express();


 app.set('view engine', 'pug'); 
 app.set('views', path.join(__dirname, '../www/pug'));

// this session will be used to save the oAuth token
app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy - HTTPS on Heroku 
app.use(session({
  secret: 'kidsforge',
  cookie: {
    httpOnly: true,
    secure: (process.env.NODE_ENV === 'production'),
    maxAge: 1000 * 60 * 60 * 24 * 31// 1 hours to expire the session and avoid memory leak
  },
  resave: false,
  saveUninitialized: true
}));

// prepare server routing
app.use('/', express.static(__dirname + '/../www')); // redirect static calls
app.use('/js', express.static(__dirname + '/../node_modules/bootstrap/dist/js')); // redirect static calls
app.use('/js', express.static(__dirname + '/../node_modules/moment/min')); // redirect static calls
app.use('/css', express.static(__dirname + '/../node_modules/bootstrap/dist/css')); // redirect static calls
app.use('/fonts', express.static(__dirname + '/../node_modules/bootstrap/dist/fonts')); // redirect static calls
app.set('port', process.env.PORT || 3000); // main port

// prepare our API endpoint routing
var addChoice = require('./addChoice');
var email = require('./email');
var grant = require('./grant');
var getPayment = require('./getPayment');

app.use('/payment', getPayment);
app.use('/wish', addChoice); 
app.use('/email', email);
app.use('/grant', grant)

module.exports = app;
