
	var express = require('express');
	var bodyParser = require('body-parser');
	var mongoose = require('mongoose');
	
	var Promotions = require('../models/promotions');
	var Verify = require('./verify');
	
	var promoRouter = express.Router();	
	promoRouter.use(bodyParser.json());
	
	promoRouter.route('/')
		.get(Verify.verifyOrdinaryUser,function(req,res,next){
			//res.end('Will send all the promotions to you!');
		    Promotions.find({}, function (err, promo) {
		        if (err) throw err;
		        res.json(promo);
		    });
		})
		.post(Verify.verifyAdmin,function(req, res, next){
			//res.end('Will add the promo: ' + req.body.name + ' with details: ' + req.body.description);
		    Promotions.create(req.body, function (err, promo) {
		        if (err) throw err;
		        console.log('Promo created!');
		        var id = promo._id;

		        res.writeHead(200, {
		            'Content-Type': 'text/plain'
		        });
		        res.end('Added the promo with id: ' + id);
		    });
		})
		.delete(Verify.verifyAdmin,function(req, res, next){
			//res.end('Deleting all promotions');
		    Promotions.remove({}, function (err, resp) {
		        if (err) throw err;
		        res.json(resp);
		    });
		});
				
		//================================================================
	
	promoRouter.route('/:promoId')		
		.get(Verify.verifyOrdinaryUser,function(req,res,next){
	        //res.end('Will send details of the promo: ' + req.params.promoId +' to you!');
		    Promotions.findById(req.params.promoId, function (err, promo) {
		        if (err) throw err;
		        res.json(promo);
		    });
		})
		.put(Verify.verifyAdmin,function(req, res, next){
			/*res.write('Updating the promo: ' + req.params.promoId + '\n');
			res.end('Will update the promo: ' + req.body.name + 
						' with details: ' + req.body.description);*/
		    Promotions.findByIdAndUpdate(req.params.promoId, {
		        $set: req.body
		    }, {
		        new: true
		    }, function (err, promo) {
		        if (err) throw err;
		        res.json(promo);
		    });
		})	
		.delete(Verify.verifyAdmin,function(req, res, next){
			//res.end('Deleting promo: ' + req.params.promoId);
		    Promotions.findByIdAndRemove(req.params.promoId, function (err, resp) {        
		    	if (err) throw err;
		    	res.json(resp);
		    });
		});
				
		//================================================================

	module.exports = promoRouter;