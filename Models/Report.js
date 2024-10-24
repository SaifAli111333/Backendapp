const mongoose = require('mongoose');

const Reportschema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
   ReportID: { 
     type: Number,  
     unique: true,
     require:true,
   },
   OrderID:Number,
   Orderby:String,
   Createdby:String,
   TextDate: {
    type: Date,
    default: Date.now 
},
isResolved: {  
    type: Boolean,
    default: false
  }
})
module.exports = mongoose.model('Report', Reportschema);