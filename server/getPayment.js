var VisaAPIClient = require('./visaapiclient');
var config = require('./config');

var express = require('express');
var bodyParser = require("body-parser");
var app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/',  function (req, res) {
		var visaAPIClient = new VisaAPIClient();
		var apiKey = config.credentials.apiKey;
		var baseUri = 'wallet-services-web/';
		var resourcePath = 'payment/data/{callId}';
		resourcePath = resourcePath.replace('{callId}', req.body.payment.callid);
		var queryParams = 'apikey=' + apiKey;
		visaAPIClient.doXPayRequest(baseUri, resourcePath, queryParams, '', 'GET', {}, 
		function(err, res, req) {
			if(!err) {
				console.log(res); //to Payment gateway
			} else {
				console.log(err)
			}
		});
		res.send('successful');
	})
	
module.exports=app;