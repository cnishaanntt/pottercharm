//path 
var path = require('path');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('./config');
var gmail_id =  config.credentials.gmail_id;
var gmail_pwd =  config.credentials.gmail_pwd;

// web framework
var express = require('express');
var bodyParser =  require("body-parser");
var app = express();
app.locals.moment = require('moment');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.post('/',  function (req, res) {
    var mailer=[];
    mailer.receiverEmailId=req.body.username;
    email(mailer, res)    
})
var email = (mailer, res) =>{	
	// Generate SMTP service account email
	nodemailer.createTestAccount((err) => {
		if (err) {
			console.error('Failed to create a testing account. ' + err.message);
			return process.exit(1);
		}
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com',
	    port: 587,
	    secure: false,
        auth: {
            user: gmail_id,
            pass: gmail_pwd
        }
    }));
    // Message object
    let message = {
        from: gmail_id,
        to: mailer.receiverEmailId,
        subject:  ' Expecto ✔',
        text:'Dear Friend, Celebrate your loved ones fascinations at https://pottercharm.herokuapp.com/grant?username='+mailer.receiverEmailId.substring(0, mailer.receiverEmailId.lastIndexOf("@"))+ '&domain='+mailer.receiverEmailId.substring(mailer.receiverEmailId.lastIndexOf("@") +1)+'. Cheers, Expecto*',
        html: '<p>Dear Friend, </p><p><i>Celebrate </i> your loved ones <b>fascinations</b> at https://pottercharm.herokuapp.com/grant?username='+mailer.receiverEmailId.substring(0, mailer.receiverEmailId.lastIndexOf("@"))+ '&domain='+mailer.receiverEmailId.substring(mailer.receiverEmailId.lastIndexOf("@") +1)+'.</p><p> Remember to click the Home button to share yours....</p><p>Check Christopher Robin at https://www.youtube.com/watch?v=0URpDxIjZrQ</p> <p>Like us at https://devpost.com/software/zauber </p><br/><p>Cheers,</p><p>Expecto*</p>'			   
    };
    transporter.sendMail(message, (err) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }
    });
});
		res.send('mail sent');
}
	

module.exports = app;
