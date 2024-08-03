//path 
var path = require('path');
var request = require('request');
var drawings = require('./drawing');
var config = require('./config');
var walmart_key = config.credentials.walmart_key;

// web framework
var express = require('express');
var bodyParser = require("body-parser");
var app = express();
app.locals.moment = require('moment');
app.set('view engine', 'pug'); 
app.set('views', path.join(__dirname, '../www/pug'));

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/',  function (req, res) {
            drawings.aggregate([ 
                        { $match : {
                            username:req.query.username+'@'+req.query.domain
                        }},
                        { $group : {
                            _id:{username:"$username",
                            drawing:"$drawing"},
                            count: { $sum: 1 }
                        }},{ 
                            $sort:{
                                count: -1
                            }                                                        
                        },{
                            $limit : 5
                        }]).then(function(imagination) {
                            res.render('fulfill', {'imagination':imagination})
                      });  
})
app.get('/delete', function(req,res){
    drawings.deleteOne( { username :req.query.username, drawing:req.query.drawing }).then(function(result){
    res.redirect('/grant?username='+req.query.username.substring(0, req.query.username.lastIndexOf("@"))+'&domain='+req.query.username.substring(req.query.username.lastIndexOf("@") +1))
    });
})
app.get('/fulfill', function(req,res){
    /*request({
        url:'http://api.walmartlabs.com/v1/search?apiKey='+walmart_key+'&query='+req.query.drawing+'&facet=on',
        json: true },
        function (error, response) {
            if (!error && response.statusCode === 200) {
                res.render('walmart',{Items:response.body.items} )          
            }})*/

            window.location.replace('https://www.amazon.com/'+req.query.drawing+'/s?k='+req.query.drawing)
})
module.exports = app;