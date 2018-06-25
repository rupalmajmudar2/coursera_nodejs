// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Dishes= require('./dishes'); //for the Dish schema
var dishSchema= Dishes.schema; 

var favoriteSchema = new Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    },
    dishes: [dishSchema]
}, {
    timestamps: true
});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;