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
var jwt = require('jsonwebtoken');

var port = process.env.PORT || 8080;
var config = require('./config');
var User = require('./app/models/user');

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

// an instance of the express router
var apiRouter = express.Router();

apiRouter.post('/auth', function (req, res) {
    User.findOne({username: req.body.username})
        .select('name username password')
        .exec(function (err, user) {
            if (err) {
                throw err;
            }

            // no user with that username found
            if (!user) {
                res.json({success: false, message: 'Authentication failed. User not found.'});
            } else if (user) {
                var validPassword = user.comparePassword(req.body.password);

                if (!validPassword) {
                    res.json({success: false, message: 'Authentication failed. Wrong password.'});
                } else {
                    //create token
                    var token = jwt.sign(
                        {
                            name: user.name,
                            username: user.username
                        },
                        config.secret,
                        {
                            expiresInMinutes: 1440 // 24 hours
                        }
                    );

                    res.json({
                        success: true,
                        message: 'Enjoy your token',
                        token: token
                    });
                }


            }
        });
});

// route middleware
apiRouter.use(function (req, res, next) {

    // check post parameters or url parameters or header for token
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    // decode token
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

// api endpoint to get user information
apiRouter.get('/me', function (req, res) {
    res.send(req.decoded);
});

apiRouter.get('/', function (req, res) {
    res.json({message: 'Manthano api!'});
});

apiRouter.route('/users')
    .post(function (req, res) {
        // create a new instance of the User models
        var user = new User();

        // set information
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        // save user and check for error
        user.save(function (err) {
            if (err) {
                // duplicate entry
                if (err.code == 11000) {
                    return res.json({
                        success: false,
                        message: 'A user with that username already exists. '
                    });
                } else {
                    res.send(err);
                }

            }

            res.json({message: 'User created!'});

        });

    })

    .get(function (req, res) {
        User.find(function (err, users) {
            if (err) {
                res.send(err);
            }

            res.json(users);
        });
    })
;

apiRouter.route('/users/:user_id')
    .get(function (req, res) {
        User.findById(req.params.user_id, function (err, user) {
            if (err) {
                res.send(err);
            }

            res.json(user);
        });
    })

    .put(function (req, res) {
        User.findById(req.params.user_id, function (err, user) {
            if (err) {
                res.send(err);
            }

            // update the users info only if its new
            if (req.body.name)     user.name = req.body.name;
            if (req.body.username) user.username = req.body.username;
            if (req.body.password) user.password = req.body.password;

            // save the user
            user.save(function (err) {
                if (err) {
                    res.send(err);
                }

                res.json({message: 'User updated!'});
            });
        });
    })

    .delete(function (req, res) {
        User.remove({_id: req.params.user_id}, function (err/*, user*/) {
                if (err) {
                    res.send(err);
                }

                res.json({message: 'User deleted!'});
            }
        );
    })
;

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

// START THE SERVER
// ===============================
app.listen(port);
console.log('Manthano started on port ' + port);

