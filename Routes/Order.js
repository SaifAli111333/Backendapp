const express = require('express');
const router = express.Router();
const Order = require('../Models/Order');
const mongoose = require('mongoose');
const authenticateToken = require('../MIddleware/Authentication');
const getNextSequenceValue = require('../Models/getNextSequenceValue');
const Product = require('../Models/Product');
const Reservation = require('../Models/Reservation');

// router.post('/', authenticateToken, async (req, res) => {
//     try {
//         const nextId = await getNextSequenceValue('orderId'); 

//         const { productId: productIdFromBody, createdBy, Reservedby } = req.body;

//         if (!productIdFromBody) {
//             return res.status(400).json({ error: 'ProductID is required' });
//         }
//         if (!createdBy) {
//             return res.status(400).json({ error: 'CreatedBy is required' });
//         }
//         if (!Reservedby) {
//             return res.status(400).json({ error: 'ReservedBy is required' });
//         }

//         const productId = Number(productIdFromBody);
//         const product = await Product.findOne({ ProductID: productId });

//         if (!product) {
//             return res.status(404).json({ error: 'Product not found' });
//         }

//         const newOrder = new Order({
//             _id: new mongoose.Types.ObjectId(),
//             OrderID: nextId,
//             Reservedby: Reservedby,
//             ProductID: productId,
//             Createdby: createdBy,
//             Orderedby: req.user.email,
//             Market: product.Market,
//             ProductType: product.ProductType,
//             sellerid: product.sellerid,
//             Keyword: product.Keyword,
//             ASIN: product.ASIN,
//             SoldBy: product.SoldBy,
//             Brandname: product.Brandname,
//             ProductPrice: product.ProductPrice,
//             totalCommission:product.totalCommission,
//             Ordernumber: req.body.Ordernumber,
//             Customeremail:req.body.Customeremail,
//             awzlink:req.body.awzlink,
//             OrderPhoto:req.body.OrderPhoto,
//             RefundPhoto:req.body.RefunfPhoto,
//             ReviewPhoto:req.body.ReviewPhoto,
//             OrderType:req.body.OrderType,
//             //OrderType: OrderType || 'ordered'

//         });

//         const result = await newOrder.save();
//         res.status(201).json({ result });

//     } catch (err) {
//         console.error('Error adding order:', err);
//         res.status(500).json({ error: err.message });
//     }
// });
router.post('/', authenticateToken, async (req, res) => {
    try {
        const nextId = await getNextSequenceValue('orderId'); 

        const { productId: productIdFromBody, createdBy, Reservedby, reservationId } = req.body;

        if (!productIdFromBody || !createdBy || !Reservedby || !reservationId) {
            return res.status(400).json({ error: 'ProductID, CreatedBy, ReservedBy, and ReservationID are required.' });
        }

        const productId = Number(productIdFromBody);
        const product = await Product.findOne({ ProductID: productId });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const reservation = await Reservation.findOne({ ReservationID: reservationId });
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        reservation.isActive = true; 
        await reservation.save(); 

        const newOrder = new Order({
            _id: new mongoose.Types.ObjectId(),
            OrderID: nextId,
            Reservedby: Reservedby,
            ProductID: productId,
            Createdby: createdBy,
            Orderedby: req.user.email,
            Market: product.Market,
            ProductType: product.ProductType,
            sellerid: product.sellerid,
            Keyword: product.Keyword,
            ASIN: product.ASIN,
            SoldBy: product.SoldBy,
            Brandname: product.Brandname,
            ProductPrice: product.ProductPrice,
            totalCommission: product.totalCommission,
            Ordernumber: req.body.Ordernumber,
            Customeremail: req.body.Customeremail,
            awzlink: req.body.awzlink,
            OrderPhoto: req.body.OrderPhoto,
            RefundPhoto: req.body.RefundPhoto,
            ReviewPhoto: req.body.ReviewPhoto,
            OrderType: req.body.OrderType,
        });

        const result = await newOrder.save();
        res.status(201).json({ result });

    } catch (err) {
        console.error('Error adding order:', err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { OrderType, Ordernumber, Customeremail, awzlink } = req.body;

        // Find the order by ID
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (OrderType) {
            order.OrderType = OrderType;
        }
        if (Ordernumber) {
            order.Ordernumber = Ordernumber;
        }
        if (Customeremail) {
            order.Customeremail = Customeremail;
        }
        if (awzlink) {
            order.awzlink = awzlink;
        }
        const result = await order.save();
        res.status(200).json({ result });

    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ error: err.message });
    }
}); 
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { email, usertype } = req.user; 

        if (usertype === 'pmm') {
            const orders = await Order.find({ Createdby: req.user.email });
            res.status(200).json({ orders });
        } else if (usertype === 'pm') {
            const orders = await Order.find({ Orderedby: email });
            res.status(200).json({ orders });
        } else {
            const orders = await Order.find();
            res.status(200).json({ orders });
           // res.status(403).json({ error: 'Unauthorized user type' });
        }
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: err.message });
    }
});
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { email, usertype } = req.user; 
        const { id } = req.params; 

        if (usertype === 'pmm') {
            const order = await Order.findOne({ _id: id, Createdby: email });
            if (!order) {
                return res.status(404).json({ error: 'Order not found or not authorized' });
            }
            res.status(200).json({ order });
        } else if (usertype === 'pm') {
            const order = await Order.findOne({ _id: id, Orderedby: email });
            if (!order) {
                return res.status(404).json({ error: 'Order not found or not authorized' });
            }
            res.status(200).json({ order });
        } else {
            const order = await Order.findOne({ _id: id, Orderedby: email });
            if (!order) {
                return res.status(404).json({ error: 'Order not found or not authorized' });
            }
            res.status(200).json({ order });
            // res.status(403).json({ error: 'Unauthorized user type' });
        }
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ error: err.message });
    }
});
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const OrderId = req.params.id; 

        if (!mongoose.Types.ObjectId.isValid(OrderId)) {
            return res.status(400).json({ error: 'Invalid Order ID' });
        }

        const result = await Reservation.findByIdAndDelete(reservationId);

        if (!result) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Error deleting Order:', err);
        res.status(500).json({ error: err.message });
    }
});
router.get('/count', authenticateToken, async (req, res) => {
    try {
        const { email, userType } = req.user;

        let count;
        if (userType === 'admin') {
            count = await Order.countDocuments({ createdBy: email });
        } else if (userType === 'pm') {
            count = await Order.countDocuments({ Orderedby: email });
        } else {
            count = await Order.countDocuments({ Orderedby: email });
            // res.status(403).json({ error: 'Unauthorized user type' });
        }

        res.status(200).json({ count });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
