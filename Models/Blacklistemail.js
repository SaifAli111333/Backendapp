const mongoose=require("mongoose");
const BLacklistschema = new mongoose.Schema({
  
    _id :mongoose.Schema.Types.ObjectId,
    email :String,
})
module.exports=mongoose.model("blacklistemail",BLacklistschema);