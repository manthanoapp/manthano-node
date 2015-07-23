/**
 * Created by enco on 29.5.15..
 */

// ===Packages===
// ==============
var express = require('express');
var app = express();
var bodyParser = require('body-parser'); // will let us pull POST content from our HTTP request
var morgan = require('morgan'); // allows us to log all requests to the console so we can see exactly what is going on.
var mongoose = require('mongoose');


var port = process.env.PORT || 8080;
var config = require('./config');
var User = require('./app/models/user');

var apiRouter  = require('./app/routes/apiRouter');
var activityRouter  = require('./app/routes/activityRouter');

// ===App configuration===
// =======================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect(config.db);

// configure our app to handle CORS requests
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, 22 Authorization');
    next();
});

// log all requests to the console
app.use(morgan('dev'));


// ROUTES FOR OUR API
// =============================

// basic route for the home page
app.get('/', function (req, res) {
    res.send('Welcome to Manthano home page!');
});




// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);
app.use('/activity', activityRouter);
// START THE SERVER
// ===============================
app.listen(port);
console.log('Manthano started on port ' + port);

