const mongoose = require('mongoose');

const Reservationschema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
   ReservationID: { 
     type: Number,  
     unique: true,
     require:true,
   },
   Reservedby: String,
   Createdby: String,
   ProductID:Number,
   Sellername:String,
   createdAt: { 
    type: Date, 
    default: Date.now,
    expires: '1h' 
  },
  isActive: { 
    type: Boolean,
    default: false 
  }
})
module.exports = mongoose.model('Reservation', Reservationschema);
