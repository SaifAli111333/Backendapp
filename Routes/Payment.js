const express = require('express');
const router = express.Router();
const Payment = require('../Models/Payment');
const mongoose = require('mongoose');
const authenticateToken = require('../MIddleware/Authentication');
const getNextSequenceValue = require('../Models/getNextSequenceValue');


router.post('/', authenticateToken, async (req, res) => {
    try {
        const nextId = await getNextSequenceValue('PaymentID'); 
        const newPayment = new Payment({
            _id: new mongoose.Types.ObjectId(),
            PaymentID: nextId,
            paidamount: req.body.paidamount,
            PaidBy:req.user.email,
       });

        const result = await newPayment.save();
        res.status(201).json(result);
    } catch (err) {
        console.error('Error adding report:', err);
        res.status(500).json({ error: err.message });
    }
});
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { email, usertype } = req.user; 

        if (usertype === 'pmm') {
            const Payments = await Payment.find({ PaidBy: req.user.email });
            res.status(200).json({ Payments });
        }  else if(usertype === 'admin'){
            const Payments = await Payment.find();
            res.status(200).json({ Payments });
           // res.status(403).json({ error: 'Unauthorized user type' });
        }
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
