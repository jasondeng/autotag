var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  phone_number: {type: String, unique: true},
  twitter_access_token: String
});

module.exports = mongoose.model("User", userSchema);
