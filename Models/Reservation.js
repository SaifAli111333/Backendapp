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
   Sellername:String
})
module.exports = mongoose.model('Reservation', Reservationschema);
