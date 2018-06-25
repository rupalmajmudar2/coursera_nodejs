var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Favorites are dishes a user particularly likes. Th

var favoriteSchema = new Schema({
  dishes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dish',
    unique: true
  }],
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

var Favorites = mongoose.model('Favorites', favoriteSchema);

module.exports = Favorites;
