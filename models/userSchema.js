const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  'username': {type: String, unique: 'Username is already taken', required: 'Username is required', validate: {
    validator: function(username) {
      return username.length >= 4;
    },
    message: 'Username is too short!',
  }},
  'password': String,
  'salt': String,
  'is_admin': {type: Boolean, default: false},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema, 'users');
