const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  ProductID: { 
    type: Number,  
    unique: true,
    required: true,
  },
  totalCommission: { type: Number, default: 0 },
  Market: String,
  ProductType: String,
  sellerid: Number,
  SaleLimit: Number,
  TodayRemaining: Number,
  TotalRemaining: Number,
  Keyword: String,
  ASIN: String,
  SoldBy: String,
  Brandname: String,
  ProductPrice: String,
  ComissionType: String,
  TextReview: Number,
  PictureReview: Number,
  VedioReview: Number,
  TextTopReview: Number,
  PictureTopReview: Number,
  VedioTopReview: Number,
  Rating: Number,
  NoReview: Number,
  Feedback: Number,
  Giveaway: Number,
  createdBy: String,
  createdDate: {
    type: Date,
    default: Date.now 
}
});

module.exports = mongoose.model('Product', ProductSchema);
