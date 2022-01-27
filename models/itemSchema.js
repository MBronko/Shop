const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  'name': String,
  'decription': String,
  'price': Number,
  'quantity': Number,
});

module.exports = mongoose.model('Item', userSchema, 'items');
