const cron = require('node-cron');
const mongoose = require('mongoose');
const DelayRefund = require('./Models/DelayRefund'); 

const mongoURI = 'mongodb+srv://saif64459:db123@cluster0.8b1vihb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 30000,
})
.then(() => {
  console.log('MongoDB connected successfully');
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const delayRefunds = await DelayRefund.find();
      console.log(`Found ${delayRefunds.length} delay refunds.`);

      for (const delayRefund of delayRefunds) {
        const createdDate = new Date(delayRefund._id.getTimestamp());
        const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

        if (diffDays > delayRefund.DelayDaysno) {
          console.log(`Updating DelayDaysno from ${delayRefund.DelayDaysno} to ${diffDays}`);
          delayRefund.DelayDaysno = diffDays;
          await delayRefund.save();
        }
      }

      console.log('DelayDaysno field updated successfully.');
    } catch (err) {
      console.error('Error updating DelayDaysno:', err);
    }
  });
})
.catch(err => console.error('MongoDB connection error:', err));
