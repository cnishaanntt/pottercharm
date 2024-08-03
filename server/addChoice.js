//path 
var path = require('path');
var drawing = require('./drawing');

// web framework
var express = require('express');
var bodyParser     =        require("body-parser");
var app = express();
app.locals.moment = require('moment');
app.set('view engine', 'pug'); 
app.set('views', path.join(__dirname, '../www/pug'));

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/',  function (req, res, err) {
    var choiceToDb = new drawing({
        username:req.body.username,
        drawing:req.body.drawing
    })
    choiceToDb.save(); 
res.send(':)') 
})

module.exports = app;