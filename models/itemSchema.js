const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  'name': String,
  'description': String,
  'price': Number,
  'quantity': Number,
  'imgExt': String,
});

module.exports = mongoose.model('Item', userSchema, 'items');
