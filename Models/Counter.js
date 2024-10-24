// models/Counter.js
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: String,  // The name of the counter (e.g., 'productId')
  sequence_value: Number
});

module.exports = mongoose.model('Counter', counterSchema);
