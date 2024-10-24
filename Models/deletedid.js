const mongoose = require('mongoose');

const deletedIDSchema = new mongoose.Schema({
  id: Number
});

module.exports = mongoose.model('DeletedID', deletedIDSchema);
