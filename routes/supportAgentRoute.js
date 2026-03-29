const express = require('express');
const {SupportAgent} = require('../models/supportAgent.model');
const Auth = require("../middleware/authMiddleWare");
const isSuperAdmin = require("../middleware/roleMiddleWare");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET_KEY;

router.post('/create-support-agent', Auth, isSuperAdmin, async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password } = req.body;
        if (!firstName || !lastName || !email || !phoneNumber || !password) return res.status(400).json({ status: false, message: "All fields are required" });
        const existingSupportAgent = await SupportAgent.findOne({ email });
        if (existingSupportAgent) return res.status(400).json({ status: false, message: "Email already registred" });
         const existingSupportAgentPhone = await SupportAgent.findOne({ phoneNumber });
        if (existingSupportAgentPhone) return res.status(400).json({ status: false, message: "Phone Number already registred" });
        const hashPassword = await bcrypt.hash(password, 10);
        const newSupportAgent = new SupportAgent({ firstName, lastName, email, phoneNumber, password: hashPassword });
        await newSupportAgent.save();
        res.status(201).json({ status: true, message: "Support Agent Created Successfully", data: newSupportAgent });
    }
    catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong", error: error.message });
    }
})

router.get('/get-support-agent',Auth, async (req, res) => {
    try {
        const getSupportAgent = await SupportAgent.find({}).sort({ createdAt: -1 });
        res.status(200).json({ status: true, message: "Support Agent Data fetched", data: getSupportAgent });
        console.log("data Support Agent", getSupportAgent);
    }
    catch (error) {
        res.status(400).json({ status: false, message: "something went wrong !!!", error: error.message });
    }
})

router.get('/create-support-agent/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const response = await SupportAgent.findById(id).select("-password");
        if (!response) return res.status(404).json({ status: false, message: "Support agent not found" });
        res.status(200).json({ status: true, message: "Support Agent fetched successfully !", data: response })
    }
    catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong", error: error.message });
    }
})

router.put('/create-support-agent/:id',Auth, isSuperAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const data = { ...req.body };
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const response = await SupportAgent.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        res.status(200).json({ status: true, message: "Support Agent updated successfully !", data: response })
    }
    catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong", error: error.message });
    }
})

router.delete('/delete-support-agent/:id', Auth, isSuperAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const deletedSupportAgent = await SupportAgent.findByIdAndDelete(id);
        res.status(200).json({ status: true, message: "Support Agent Deleted", data: deletedSupportAgent });
    }
    catch (error) {
        res.status(400).json({ status: false, message: "something went wrong !!!", error: error.message });
    }
})

router.get('/profile', Auth, async (req, res) => {
    try {
        const SupportDataNew = await SupportAgent.findById(req.user.id);
        if (!SupportDataNew) {
            return res.status(400).json({ status: false, message: "Support Agent not found" });
        }
        const SupportAgentData = {
            id: SupportDataNew?._id,
            firstName: SupportDataNew?.firstName,
            lastName: SupportDataNew?.lastName,
            email: SupportDataNew?.email,
            phoneNumber: SupportDataNew?.phoneNumber,
            role: SupportDataNew?.role,
            created: SupportDataNew?.createdAt,
        };
        res.status(200).json({ status: true, data: SupportDataNew });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

module.exports = router;