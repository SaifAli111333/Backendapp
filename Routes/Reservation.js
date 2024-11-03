const express = require('express');
const router = express.Router();
const Reservation = require('../Models/Reservation');
const Product = require('../Models/Product');
const cron = require('node-cron'); 
const mongoose = require('mongoose');
const authenticateToken = require('../MIddleware/Authentication');
const getNextSequenceValue = require('../Models/getNextSequenceValue');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const nextId = await getNextSequenceValue('reservationId');
        const { productId, createdBy } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'ProductID is required' });
        }
        if (!createdBy) {
            return res.status(400).json({ error: 'CreatedBy is required' });
        }

        const product = await Product.findOne({ ProductID: productId }); // Use ProductID to find

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.TodayRemaining <= 0) {
            return res.status(403).json({ error: 'Today’s sale limit has been reached for this product.' });
        }

        if (product.TotalRemaining <= 0) {
            return res.status(403).json({ error: 'Total sale limit has been reached for this product.' });
        }

        const newReservation = new Reservation({
            _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the reservation
            ReservationID: nextId,
            Reservedby: req.user.email,
            ProductID: productId, // Keep this as a custom ID
            Createdby: createdBy,
        });

        const result = await newReservation.save();

        await Product.findByIdAndUpdate(product._id, {
            $inc: { TodayRemaining: -1, TotalRemaining: -1 }
        });

        res.status(201).json({
            ...result._doc,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000) 
        });

    } catch (err) {
        console.error('Error adding reservation:', err);
        res.status(500).json({ error: err.message });
    }
});
router.delete('/:reservationId', authenticateToken, async (req, res) => {
    try {
        const { reservationId } = req.params;

        const reservation = await Reservation.findOne({ ReservationID: reservationId });

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        const product = await Product.findOne({ ProductID: reservation.ProductID });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await Reservation.deleteOne({ ReservationID: reservationId });

        await Product.findByIdAndUpdate(product._id, {
            $inc: { TodayRemaining: 1, TotalRemaining: 1 }
        });

        res.status(200).json({ message: 'Reservation deleted successfully and product counts updated' });
    } catch (err) {
        console.error('Error deleting reservation:', err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/', authenticateToken, async (req, res) => {
    try {
        const reservations = await Reservation.find({ Reservedby: req.user.email });
        res.status(200).json({ reservations });
    } catch (err) {
        console.error('Error fetching reservations:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE route to remove a reservation by ID
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const reservationId = req.params.id; // Extract reservation ID from URL parameters

        // Check if the ID is valid
        if (!mongoose.Types.ObjectId.isValid(reservationId)) {
            return res.status(400).json({ error: 'Invalid reservation ID' });
        }

        // Attempt to delete the reservation by its ID
        const result = await Reservation.findByIdAndDelete(reservationId);

        if (!result) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (err) {
        console.error('Error deleting reservation:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
