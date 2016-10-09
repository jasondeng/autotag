var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  phone_number: {type: String, unique: true},
  access_token: String,
  access_token_secret: String
});

module.exports = mongoose.model("User", userSchema);
