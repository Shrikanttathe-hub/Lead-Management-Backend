const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {SuperAdmin} = require('../models/superAdmin.model');
const {SubAdmin} = require('../models/subAdmin.model');
const {SupportAgent} = require('../models/supportAgent.model');
const JWT_SECRET = process.env.SECRET_KEY;

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ status: false, message: "All fields are compulsary" });
        console.log("Trying SuperAdmin...");
        let user = await SuperAdmin.findOne({email});
        role="Super Admin";
        if(!user){
        console.log("Trying SubAdmin...");
        user = await SubAdmin.findOne({email});
        role="Sub Admin";
       }
       if(!user){
       console.log("Trying SupportAgent...");
       user = await SupportAgent.findOne({email});
       role="Support Agent";
       }
        console.log("User found:", user);
        if(!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({status:false, message:"Invalid Credentials!!!"});
        //create token with role
        const token = jwt.sign({id: user._id, email: user.email, role: role}, JWT_SECRET, {expiresIn: "1d"});
        res.status(200).json({ status: true, message: `Welcome Back ${user.firstName} !`, token, role });
    }
    catch (error) {
        console.log("ERROR", error.message);
        res.status(400).json({ status: false, message: "something went wrong !", error: error.message });
    }
})

module.exports = router;