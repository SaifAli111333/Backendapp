const mongoose=require("mongoose");
const Paymentschema = new mongoose.Schema({
  
    _id :mongoose.Schema.Types.ObjectId,
    totalamount :Number,
    paidamount  :Number,
    pay : Number,
})
module.exports=mongoose.model("payment",Paymentschema);