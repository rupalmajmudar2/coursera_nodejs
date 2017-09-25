
	var express = require('express');
	var bodyParser = require('body-parser');
	var mongoose = require('mongoose');

	var Favorites = require('../models/favorites');
	var Dishes = require('../models/dishes');
	var Verify = require('./verify');

	var favoriteRouter = express.Router();	
	favoriteRouter.use(bodyParser.json());
	
favoriteRouter.route('/')
//.all(Verify.verifyOrdinaryUser)

.get(function (req, res, next) {
	Favorites.find({})
        .populate('postedBy')
        .exec(function (err, favorite) {
	        if (err) throw err;
	        res.json(favorite);
    });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
	console.log("favRouter.js req = " + JSON.stringify(req.params) + " body="  + JSON.stringify(req.body));
	Dishes.findById(req.body._id)
	    .exec(function (err, dish) {
	    if (err) {throw err;} //dish not found in the Dishes list - error!
	    console.log("Found dish=" + JSON.stringify(dish));
	    //console.log("Current favDishes list is: " + JSON.stringify(this.dishes));
	    //The dish id (_id) is valid. So now check if it is already in our Favorites list.
	    	//that later
	    //And if not present, add to the fav-dishes list
	    	//do this first!
	    Favorites.create(req.body, function (err, favorite) {
	        if (err) throw err;
	        console.log('Favorite created: ' + JSON.stringify(favorite));
	        //favorite.dishes.push(dish);
	        if (favorite.dishes.indexOf(dish) === -1) {
	        	favorite.dishes.push(dish);
	        	favorite.postedBy = req.decoded.data._id;
		        favorite.save(function (err, favorite) {
		            if (err) throw err;
		            console.log('Updated Fav dishes array!');
		            res.json(favorite);
		        });
		        console.log('Favorite dishes added: ' + JSON.stringify(favorite));
	        }
	        else {
	        	console.log("This dish already exists as a favorite.");
	        }
	    });
    });
    /*Favorites.create(req.body, function (err, favorite) {
        if (err) throw err;
        console.log('Favorite created: ' + JSON.stringify(favorite));
        var id = dish._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end('Added the favorite with id: ' + id);
    });*/
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
	console.log("fav delete id=" + req.body._id);
	Favorites.findByIdAndRemove(req.body._id, function (err, resp) {
    if (err) throw err;
    res.json(resp);
});
	
});

	//================================================================
	module.exports = favoriteRouter;