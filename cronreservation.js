const cron = require('node-cron');
const mongoose = require('mongoose');
const Reservation = require('./Models/Reservation');
const Product = require('./Models/Product');

const mongoURI = 'mongodb+srv://saif64459:db123@cluster0.8b1vihb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 30000,
})
.then(() => {
  console.log('MongoDB connected successfully');
  
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const expiredReservations = await Reservation.find({
        expiresAt: { $lt: now },
        isActive: false
      });

      console.log(`Found ${expiredReservations.length} expired reservations.`);

      for (const reservation of expiredReservations) {
        // Find the associated product using the ProductID from the reservation
        const product = await Product.findOne({ ProductID: reservation.ProductID });

        if (product) {
          await Product.findByIdAndUpdate(product._id, {
            $inc: { TodayRemaining: 1, TotalRemaining: 1 }
          });
        }

        await Reservation.deleteOne({ ReservationID: reservation.ReservationID });

        console.log(`Expired reservation with ID: ${reservation.ReservationID} has been deleted.`);
      }

      console.log('Expired reservations processed successfully.');
    } catch (err) {
      console.error('Error processing expired reservations:', err);
    }
  });
})
.catch(err => console.error('MongoDB connection error:', err));
