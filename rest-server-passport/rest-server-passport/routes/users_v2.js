	var express = require('express');
	var bodyParser = require('body-parser');
	var mongoose = require('mongoose');
	
var router = express.Router();
router.use(bodyParser.json());

var passport = require('passport');
var User = require('../models/user');
var Verify    = require('./verify');

/* GET users listing. */
//router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
router.route('/')
	.get(Verify.verifyAdmin,function(req,res,next){
	    User.find({}, function (err, dish) {
	        if (err) throw err;
	        res.json(dish);
	    });
	});

router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }),
      req.body.password, function(err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }
        passport.authenticate('local',{ failWithError: true })(req, res, function () {
            return res.status(200).json({status: 'Registration Successful!'});
        });
    });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.login(user, function(err) {
      if (err) {
    	  console.log('Login failed for user: ' + user + ' with err=' + err);
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
        
      var token = Verify.getToken(user);
              res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);
});

router.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

module.exports = router;