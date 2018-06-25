var express = require('express');
var bodyParser = require('body-parser');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
  .all(Verify.verifyOrdinaryUser)
  .get(function (req, res, next) {
    var userID = req.decoded._doc._id;

    Favorites
      .findOne({
        postedBy: userID
      })
      .populate('postedBy dishes')
      .exec(function (err, favorite) {
        if (err) throw err;

        res.json(favorite);
      });
  })
  .post(function (req, res, next) {
    var userID = req.decoded._doc._id;

    Favorites
      .findOneAndUpdate({
        postedBy: userID
      }, {
        $addToSet: {
          dishes: req.body
        }
      }, {
        upsert: true,
        new: true
      }, function (err, favorite) {
        if (err) throw err;

        res.json(favorite);
      });
  })
  .delete(function (req, res, next) {
    var userID = req.decoded._doc._id;

    Favorites
      .findOneAndRemove({
        postedBy: userID
      }, function (err, resp) {
        if (err) throw err;
        res.json(resp);
      });
  });

favoriteRouter.route('/:dishId')
  .all(Verify.verifyOrdinaryUser)
  .delete(function (req, res, next) {
    var userID = req.decoded._doc._id;

    Favorites.findOneAndUpdate({
      postedBy: userID
    }, {
      $pull: {
        dishes: req.params.dishId
      }
    }, {
      new: true
    }, function (err, favorite) {
      if (err) throw err;

      res.json(favorite);
    });
  });

module.exports = favoriteRouter;