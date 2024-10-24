const express=require("express");
const router=express.Router();
const Users=require("../Models/user");
const getNextSequenceValue =require('../Models/getNextSequenceValue')
const mongoose=require("mongoose");
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");
const authenticateToken = require('../MIddleware/Authentication');

router.post('/signup', async (req, res, next) => {
    try {
        const { 
            password, retypepassword, usertype, email, firstname, lastname, 
            phonenumber, username, gender, cnic, address, 
            banktitle, bankname, banknumber, paymentmethod 
        } = req.body;

        if ( !password || !retypepassword || !usertype || !email || !firstname || !lastname || 
            !phonenumber || !username || !gender || !cnic || !address || 
            !banktitle || !bankname || !banknumber || !paymentmethod) {
            return res.status(400).json({
                error: 'All fields are required.'
            });
        }

        if (password !== retypepassword) {
            return res.status(400).json({
                error: 'Passwords do not match.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nextId = await getNextSequenceValue('user_id');

        const US = new Users({
            _id: new mongoose.Types.ObjectId(),
            password: hashedPassword,
            retypepassword: hashedPassword,
            user_id: nextId,
            usertype,
            email,
            firstname,
            lastname,
            phonenumber,
            username,
            gender,
            cnic,
            address,
            banktitle,
            bankname,
            banknumber,
            paymentmethod
        });

        const result = await US.save();
        console.log(result);
        res.status(200).json({
            result: result
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    }
});
/*router.get('/:id',(req,res,next)=>{
    console.log(req.params.id);
    Users.findById(req.params.id)
    .then(users=>{
        console.log(users);
        res.status(200).json({
            users:users
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            erorr:err.message
        });
    })
})*/
/////////////////
/*router.use(authMiddleware);
router.post('/signout', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);

        blacklistedTokens.add(token);

        res.status(200).json({ message: 'Successfully signed out' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to sign out' });
    }
});*/

router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Users.findById(userId).exec();

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

router.put('/:id',(req,res,next)=>{
            console.log(req.params.id);
            Users.updateOne({_id:req.params.id},
                {
                $set:{
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password,
                    usertype:req.body.usertype
                }
            })
            .then(result=>{
                console.log(result);
                res.status(200).json({
                    message : 'updated',
                    result:result
                });
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    erorr:err.message
                });
            })
})
router.get('/',(req,res,next)=>{
            Users.find()
            .then(users=>{
                console.log(users);
                res.status(200).json({
                    users:users
                });
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    erorr:err.message
                });
            })
            
})
router.post('/changepassword',authenticateToken, async (req, res) => {
    const {  password, newPassword, retypeNewPassword } = req.body;
    const user_id =req.user.user_id;

    if ( !password || !newPassword || !retypeNewPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== retypeNewPassword) {
        return res.status(400).json({ message: 'New passwords do not match' });
    }

    try {
        const user = await Users.findOne({ user_id }).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const match = await bcrypt.compare(password, user.password); 
        if (!match) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;

        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id',(req,res,next)=>{
            Staffs.deleteOne({_id:req.params.id})
            .then(result=>{
                console.log(result);
                res.status(200).json({
                    message : 'deleted',
                    result:result
                });
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    erorr:err.message
                });
            })
})
router.post('/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    Users.findOne({ email })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User does not exist' });
            }

            bcrypt.compare(password, user.password, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                const token = jwt.sign({
                    usertype: user.usertype,
                    email: user.email,
                    name: user.username,
                    user_id: user.user_id,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h"
                });

                res.status(200).json({
                    name: user.username,
                    email: user.email,
                    usertype: user.usertype,
                    user_id:user.user_id,
                    token: token
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err.message });
        });
});

module.exports = router;