const mongoose=require("mongoose");
const Paymentschema = new mongoose.Schema({
  
    _id :mongoose.Schema.Types.ObjectId,
    PaymentID: { 
        type: Number,  
        unique: true,
        require:true,
      },
    paidamount  :Number,
    PaidBy: String,

})
module.exports=mongoose.model("payment",Paymentschema);