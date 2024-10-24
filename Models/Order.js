const mongoose = require('mongoose');

const Orderschema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
   OrderID: { 
     type: Number,  
     unique: true,
     require:true,
   },
   Reservedby: String,
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
   totalCommission:Number,
   Customeremail:String,
   awzlink:String,
   OrderPhoto:String,
   RefundPhoto:String,
   ReviewPhoto:String,
   OrderType:String,
   OrderType: { 
    type: String, 
    default: 'ordered' 
  }
})
module.exports = mongoose.model('Order', Orderschema);
