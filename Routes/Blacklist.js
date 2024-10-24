const express = require('express');
const router = express.Router();
const Blacklist = require('../Models/Blacklistemail');
const mongoose = require('mongoose');
const authenticateToken = require('../MIddleware/Authentication');
router.post('/', authenticateToken, async (req, res) => {
    try {
        const newBlacklist = new Blacklist({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
       });

        const result = await newBlacklist.save();
        res.status(201).json(result);
    } catch (err) {
        console.error('Error adding reservation:', err);
        res.status(500).json({ error: err.message });
    }
});
router.get('/',(req,res,next)=>{
    Blacklist.find()
    .then(blacklists=>{
        console.log(blacklists);
        res.status(200).json({
            blacklists:blacklists
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            erorr:err.message
        });
    })
    
})
module.exports = router;
