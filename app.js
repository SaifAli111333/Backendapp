const express = require('express');
const app = express();
const productrouter = require('./Routes/Product');
const Reservationrouter = require('./Routes/Reservation');
const Categoriesrouter = require('./Routes/Categories');
const Reportrouter = require('./Routes/Report');
const Orderrouter=require('./Routes/Order');
const profileroute=require('./Routes/Profile');
const messageroute=require('./Routes/Messages');
const orderdelayrouter = require('./Routes/DelayRefund');
const blacklistrouter = require('./Routes/Blacklist');
const paymentrouter = require('./Routes/Payment');
const userrouter = require('./Routes/user');
const fileupload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
require('dotenv').config();
const bodyparser = require("body-parser");
const authenticateToken = require('./MIddleware/Authentication'); 
const cors = require('cors');

// mongoose.connect('mongodb+srv://saif64459:db123@cluster0.8b1vihb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//   serverSelectionTimeoutMS: 30000,
//   //useNewUrlParser: true,
//   //useUnifiedTopology: true,
// });
//mongoose.connect('mongodb+srv://saif64459:0313Saif7209@clusterpointmarketting.1uaqw.mongodb.net/?retryWrites=true&w=majority&appName=ClusterPointMarketting', {
  mongoose.connect('mongodb+srv://saif64459:0313Saif7209@clusterpointmarketting.1uaqw.mongodb.net/?retryWrites=true&w=majority&appName=ClusterPointMarketting', {
serverSelectionTimeoutMS: 30000,
  ssl: true,
 // sslValidate: true
});//

mongoose.connection.on('error', err => {
  console.log('Connection failed', err);
});

mongoose.connection.on('connected', () => {
  console.log('Connected successfully to MongoDB');
});
const jwtSecret = process.env.JWT_SECRET;


app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(fileupload({ useTempFiles: true }));

cloudinary.config({
  cloud_name: 'dsw1ve0fv',
  api_key: '228268892666568',
  api_secret: 'Dg3A_3n5CP_XZckMLVGDIQmMJgs'
});

app.use(cors({
  //origin: 'http://localhost:3001', 
  origin: [process.env.FRONTEND_URL || 'http://localhost:3001', 'http://15.206.19.211'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
}));
app.use('/Product',authenticateToken, productrouter);
app.use('/categories',authenticateToken, Categoriesrouter);
app.use('/user', userrouter);
app.use('/reservation',authenticateToken, Reservationrouter);
app.use('/order',authenticateToken, Orderrouter);
app.use('/profile',authenticateToken, profileroute);
app.use('/report',authenticateToken, Reportrouter);
app.use('/message',authenticateToken, messageroute);
app.use('/delayrefund',authenticateToken, orderdelayrouter);
app.use('/blacklist',authenticateToken, blacklistrouter);
app.use('/payment',authenticateToken, paymentrouter);

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'App is running' });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Error: Resource not found' });
});

module.exports = app;
