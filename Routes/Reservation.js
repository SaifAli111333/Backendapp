const express = require('express');
const router = express.Router();
const Reservation = require('../Models/Reservation');
const mongoose = require('mongoose');
const authenticateToken = require('../MIddleware/Authentication');
const getNextSequenceValue = require('../Models/getNextSequenceValue');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const nextId = await getNextSequenceValue('reservationId'); 
        
        const { productId, createdBy,sellername } = req.body; 

        if (!productId) {
            return res.status(400).json({ error: 'ProductID is required' });
        }
        if (!createdBy) {
            return res.status(400).json({ error: 'CreatedBy is required' });
        }

        const newReservation = new Reservation({
            _id: new mongoose.Types.ObjectId(),
            ReservationID: nextId,
            Reservedby: req.user.email, 
            ProductID: productId,
            Createdby: createdBy,
       });

        const result = await newReservation.save();
        res.status(201).json(result);
    } catch (err) {
        console.error('Error adding reservation:', err);
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
