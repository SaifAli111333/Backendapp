const mongoose = require('mongoose');

const DelayRefund = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
   OrderID: Number,
   Createdby: String,
   Orderedby:String,
   ProductID:Number,
   Market: String,
   ProductType: String,
   sellerid: Number,
   Keyword: String,
   ASIN: String,
   SoldBy: String,
   Brandname: String,
   ProductPrice: String,
   Ordernumber: Number,
   Customeremail:String,
   awzlink:String,
   OrderPhoto:String,
   DelayDaysno: { type: Number, default: 0 },
   RefundPhoto:String,
   ReviewPhoto:String,
   DelayRefundType:String,
   OrderType:String,
   createdDate: { type: Date, default: Date.now }
})
module.exports = mongoose.model('Delayrefund', DelayRefund);
