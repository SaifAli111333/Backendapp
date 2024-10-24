const express = require('express');
const router = express.Router();
const delayorder = require('../Models/DelayRefund');
const mongoose = require('mongoose');
const authenticateToken = require('../MIddleware/Authentication');
const Order = require('../Models/Order');
router.post('/', authenticateToken, async (req, res) => {
    try {

        const { orderId} = req.body;

        if (!orderId) {
            return res.status(400).json({ error: 'OrderID is required' });
        }

        const order = await Order.findOne({ OrderID: orderId });

        if (!order) {
            return res.status(404).json({ error: 'order not found' });
        }

        const newdelayOrder = new delayorder({
            _id: new mongoose.Types.ObjectId(),
            OrderID: orderId,
            ProductID: order.ProductID,
            Createdby: order.Createdby,
            Orderedby: order.Orderedby,
            Market: order.Market,
            ProductType: order.ProductType,
            sellerid: order.sellerid,
            Keyword: order.Keyword,
            ASIN: order.ASIN,
            SoldBy: order.SoldBy,
            Brandname: order.Brandname,
            ProductPrice: order.ProductPrice,
            Ordernumber: order.Ordernumber,
            Customeremail:order.Customeremail,
            awzlink:order.awzlink,
            OrderPhoto:order.OrderPhoto,
            RefundPhoto:order.RefunfPhoto,
            ReviewPhoto:order.ReviewPhoto,
            OrderType:order.OrderType,
            DelayDaysno: 0 

        });

        const result = await newdelayOrder.save();
        res.status(201).json({ result });

    } catch (err) {
        console.error('Error adding order:', err);
        res.status(500).json({ error: err.message });
    }
});
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { email, usertype } = req.user; 

        if (usertype === 'pmm') {
            const delayorders = await delayorder.find({ Createdby: req.user.email });
            res.status(200).json({ delayorders });
        } else if (usertype === 'pm') {
            const delayorders = await delayorder.find({ Orderedby: req.user.email });
            res.status(200).json({ delayorders });
        } else {
            const delayorders = await delayorder.find();
            res.status(200).json({ delayorders });
        }
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
