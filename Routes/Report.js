const express = require('express');
const router = express.Router();
const Report = require('../Models/Report');
const mongoose = require('mongoose');
const authenticateToken = require('../MIddleware/Authentication');
const getNextSequenceValue = require('../Models/getNextSequenceValue');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const nextId = await getNextSequenceValue('reportID'); 
        
        const { orderID,createdBy,orderedby } = req.body; 

        if (!orderID) {
            return res.status(400).json({ error: 'ProductID is required' });
        }
        if (!createdBy) {
            return res.status(400).json({ error: 'ProductID is required' });
        }
        if (!orderedby) {
            return res.status(400).json({ error: 'ProductID is required' });
        }


        const newReport = new Report({
            _id: new mongoose.Types.ObjectId(),
            ReportID: nextId,
            OrderID: orderID,
            TextDate: req.body.TextDate,
            isResolved:req.body.isResolved,
            Createdby:createdBy,
            Orderby:orderedby
       });

        const result = await newReport.save();
        res.status(201).json(result);
    } catch (err) {
        console.error('Error adding report:', err);
        res.status(500).json({ error: err.message });
    }
});
    //"cloudinary": "^2.4.0",

router.get('/', authenticateToken, async (req, res) => {
    try {
        const { email, usertype } = req.user; 

        if (usertype === 'pmm') {
            const reports = await Report.find({ Createdby: req.user.email });
            res.status(200).json({ reports });
        } else if (usertype === 'pmmmm') {
            const reports = await Report.find({ Orderedby: email });
            res.status(200).json({ reports });
        } else {
            const reports = await Report.find();
            res.status(200).json({ reports });
        }
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: err.message });
    }
});
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { isResolved } = req.body;

        // Find the order by ID
        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        if (isResolved) {
            report.isResolved = isResolved;
        }

        const result = await report.save();
        res.status(200).json({ result });

    } catch (err) {
        console.error('Error updating Report:', err);
        res.status(500).json({ error: err.message });
    }
}); 
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { email, usertype } = req.user; 
        const { id } = req.params; 

        if (usertype === 'pmm') {
            const report = await Report.findOne({ _id: id, Createdby: email });
            if (!report) {
                return res.status(404).json({ error: 'Order not found or not authorized' });
            }
            res.status(200).json({ report });
        } else if (usertype === 'pmmmm') {
            const report = await Report.findOne({ _id: id, Orderedby: email });
            if (!report) {
                return res.status(404).json({ error: 'Order not found or not authorized' });
            }
            res.status(200).json({ report });
        } else {
            const report = await Report.findOne({ _id: id });
            if (!report) {
                return res.status(404).json({ error: 'Order not found or not authorized' });
            }
            res.status(200).json({ report });
        }
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ error: err.message });
    }
});
router.get('/:reportID', authenticateToken, async (req, res) => {
    try {
        const { email, usertype } = req.user; 
        const { reportID } = req.params; 

        if (usertype === 'pmm') {
            const report = await Report.findOne({ ReportID: reportID, Createdby: email });
            if (!report) {
                return res.status(404).json({ error: 'Order not found or not authorized' });
            }
            res.status(200).json({ report });
        } else if (usertype === 'pmmmm') {
            const report = await Report.findOne({ ReportID: reportID, Orderedby: email });
            if (!report) {
                return res.status(404).json({ error: 'Order not found or not authorized' });
            }
            res.status(200).json({ report });
        } else {
            const report = await Report.findOne({ ReportID: reportID });
            if (!report) {
                return res.status(404).json({ error: 'Order not found or not authorized' });
            }
            res.status(200).json({ report });
        }
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;