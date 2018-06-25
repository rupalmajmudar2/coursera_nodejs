var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites')
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findOne({postedBy: req.decoded._doc._id})
            .populate('dishes')
            .populate('postedBy')
            .exec(function (err, favorite) {
                if (err) throw err;
                res.json(favorite);
            });
    })
    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findOne({
            postedBy: req.decoded._doc._id
        }, function (err, favorite) {
            if (err) console.log(err);
            if (!err && favorite !== null) {
                favorite.dishes.push(req.body._id);
                favorite.save(function (err, favorite) {
                    if (err) console.log(err);
                    console.log('Updated Favorite!');
                    res.json(favorite);
                });
            } else {
                favorite = new Favorites({
                    postedBy: req.decoded._doc._id
                });
                favorite.dishes.push(req.body._id);
                favorite.save(function (err, favorite) {
                    if (err) console.log(err);
                    console.log('Created Favorite!');
                    res.json(favorite);
                });
            }
        });
    })
    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findOne({
            postedBy: req.decoded._doc._id
        }, function (err, favorite) {
            if (err) throw err;
            if (favorite.dishes.length > 0) {
                for(var i = favorite.dishes.length - 1 ; i>=0; i--)
                    favorite.dishes.remove(favorite.dishes[i].ref);
                favorite.save(function (err, resp) {
                    if (err) throw err;
                    res.json(resp);
                });
            }
        });
    });

favoriteRouter.route('/:dishId')
    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findOne({
            postedBy: req.decoded._doc._id
        }, function (err, favorite) {
            if (err) throw err;
            favorite.dishes.remove(req.params.dishId);
            favorite.save(function (err, resp) {
                if (err) throw err;
                res.json(resp);
            });
        });
    });

module.exports = favoriteRouter;
