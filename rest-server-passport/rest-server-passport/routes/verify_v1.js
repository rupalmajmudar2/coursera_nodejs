var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');

exports.getToken = function (user) {
    return jwt.sign({data:user}, config.secretKey, {
        expiresIn: 72000
    });
};

exports.verifyOrdinaryUser = function (req, res, next) {
    // check header or url parameters or post parameters for token
	console.log('#verifyOrdinaryUser req body is ' + JSON.stringify(req.body) +  ' req qry is ' + JSON.stringify(req.query) 
				+  ' req hdrs is ' + JSON.stringify(req.headers));
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    console.log('Token is: ' + token);
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};