
var express = require('express');
// an instance of the express router
var apiRouter = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');

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

apiRouter.post('/users', function (req, res) {
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
});

// route middleware
/*apiRouter.use(function (req, res, next) {

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
});*/

// api endpoint to get user information
apiRouter.get('/me', function (req, res) {
    res.send(req.decoded);
});

apiRouter.get('/', function (req, res) {
    res.json({message: 'Manthano api!'});
});

apiRouter.get('/users', function (req, res) {
    User.find(function (err, users) {
        if (err) {
            res.send(err);
        }

        res.json(users);
    });
});

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

module.exports = apiRouter;
