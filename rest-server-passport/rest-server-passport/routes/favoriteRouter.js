
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
	    //console.log("Current favDishes list is: " + JSON.stringify(this.dishes));
	    //The dish id (_id) is valid. So now check if it is already in our Favorites list.
	    //e.g. db.Employee.find({EmployeeName : "Smith"}).forEach(printjson);
	    var id= req.body._id;
	    //console.log("Valid dish Id: " + id);
	    Favorites.find({_id : id})
	     	.exec(function (err, fav) {
	     		if (fav.length>0) { //} && fav !== 'null' && fav !== 'undefined') {
	     			console.log("Dish already present as fav: " + id + ". IGNORE this post."); // obj=" + JSON.stringify(fav));
	     			res.json(fav);
	     		}
	     		else { //dish not found in the current favs list - add it!
	     			//console.log("Dish NOT present in fav: " + id);
	     			
	     		    //And if not present, add to the fav-dishes list

	     		    Favorites.create(req.body, function (err, favorite) {
	     		        if (err) throw err;
	     		        console.log('Favorite created: ' + JSON.stringify(favorite));
	     	        	favorite.dishes.push(dish);
	     	        	favorite.postedBy = req.decoded.data._id;
	     		        favorite.save(function (err, favorite) {
	     		            if (err) throw err;
	     		            console.log('Updated Fav dishes array!');
	     		            res.json(favorite);
	     		        });
	     		        console.log('Favorite dishes added: ' + JSON.stringify(favorite));
	     		    });
	     		}
	     	});
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
	Favorites.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
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