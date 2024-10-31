const mongoose=require("mongoose");
const userschema = new mongoose.Schema({
  
    _id :mongoose.Schema.Types.ObjectId,
    user_id: { 
        type: Number,  
        unique: true,
        require:true,
      },
    firstname :String,
    lastname : String,
    email : String,
    password :String,
    retypepassword:String,
    usertype : String,
    phonenumber:Number,
    username:String,
    gender:String,
    cnic :Number,
    address:String,
    banktitle:String,
    bankname:String,
    banknumber:String,
    paymentmethod:String,
    profilepic:String 
})
module.exports=mongoose.model("user",userschema);