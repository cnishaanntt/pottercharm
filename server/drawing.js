var mongoose = require('mongoose');
var config = require('./config');
console.log(mongoose.version);
var uri =  config.credentials.mongodb_url;
var options = {
  //useMongoClient: true,
  autoIndex: false, // Don't build indexes
  //reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  //reconnectInterval: 500, // Reconnect every 500ms
  //poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  //bufferMaxEntries: 0
};
mongoose.connect(uri, options);
var Schema = mongoose.Schema;

// create a schema
var drawingSchema = new Schema({
  username: { type: String, required: true, unique:true, index:true },
  drawing:{ type: String, required: true},
  drawnOn:Date
});

drawingSchema.pre('save', function(next) {
  // change the scannedAt field to current date
  this.drawnOn = new Date();
  next();
});

drawingSchema.index({ name: 1, type: -1 })

// we need to create a model using it
var drawing = mongoose.model('drawing', drawingSchema);

// make this available to our users in our Node applications
module.exports = drawing;