'use strict'; // http://www.w3schools.com/js/js_strict.asp

module.exports = {
    // set enviroment variables or hard-code here
    credentials: {
        mongodb_url:process.env.MONGODB_URL,
        gmail_id:process.env.GMAIL_ID,
        gmail_pwd:process.env.GMAIL_PWD,
        walmart_key:process.env.WALMART_KEY,
        "apiKey": process.env.VISA_API_KEY,
        "sharedSecret": process.env.SHARED_SECRET,
        "userId": process.env.USER_ID,
        "password": process.env.PASSWORD,
        "cert": "/security/cert.pem",
        "key": "/security/key_c33b176f-2f46-4ef6-b867-015a9698ef9d.pem",
        "checkoutCallId" : "6046589837988198001",
        "visaUrl": "https://sandbox.api.visa.com/"
            }
}