const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  'username': {type: String, unique: 'Username is already taken', required: 'Username is required', validate: {
    validator: function(username) {
      return username.length >= 4;
    },
    message: 'Username is too short!',
  }},
  'password': String,
  'is_admin': {type: Boolean, default: false},
});

userSchema.plugin(uniqueValidator);

userSchema.methods.setPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
};

userSchema.methods.authenticatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema, 'users');
