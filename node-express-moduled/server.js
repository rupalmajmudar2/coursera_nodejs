var dishRouter = require('./dishRouter');
var promoRouter = require('./promoRouter');
var leaderRouter = require('./leaderRouter');

var express = require('express');
var app = express();
var morgan = require('morgan');
app.use(morgan('dev'));

app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use(express.static(__dirname + '/public'));

app.listen(3000, 'localhost', function(){
  console.log('Server running at http://localhost/3000');
});