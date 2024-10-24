const express = require('express');
const router = express.Router();
const Users = require('../Models/user');
const authMiddleware = require('../MIddleware/Authentication'); 

router.get('/', authMiddleware, async (req, res) => {
    try {
        const email = req.user.email; 
        const user = await Users.findOne({ email }).exec(); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user: {
                user_id: user.user_id,
                email: user.email,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                phonenumber: user.phonenumber,
                gender: user.gender,
                cnic: user.cnic,
                address: user.address,
                banktitle: user.banktitle,
                bankname: user.bankname,
                banknumber: user.banknumber,
                paymentmethod: user.paymentmethod
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
