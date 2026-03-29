const express = require('express');
const {SuperAdmin} = require('../models/superAdmin.model');
const {SubAdmin} = require('../models/subAdmin.model');
const Auth = require("../middleware/authMiddleWare");
const isSuperAdmin = require("../middleware/roleMiddleWare");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET_KEY;

router.post('/sign-up', Auth, isSuperAdmin,  async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password } = req.body;
        if (!firstName || !lastName || !email || !phoneNumber || !password) return res.status(400).json({ status: false, message: "All fields are compulsory" });
        const existingSuperAdmin = await SuperAdmin.findOne({ email });
        if (existingSuperAdmin) return res.status(400).json({ status: false, message: "Email already registered" });
        const existingSuperAdminPhone = await SuperAdmin.findOne({ phoneNumber });
        if (existingSuperAdminPhone) return res.status(400).json({ status: false, message: "Phone number already registered" });
        const hashPassword = await bcrypt.hash(password, 10);
        const newSuperAdmin = new SuperAdmin({ firstName, lastName, email, phoneNumber, password: hashPassword });
        await newSuperAdmin.save();
        const token = jwt.sign({ id: newSuperAdmin._id, email: newSuperAdmin.email, role: newSuperAdmin.role }, JWT_SECRET, { expiresIn: "10h" });
        return res.status(201).json({ status: true, message: "Sign-Up Successful", token, newSuperAdmin });
    }
    catch (error) {
        console.log(error, "Error Found");
        res.status(400).json({ status: false, message: "Something went wrong !", error: error.message });
    }
});
router.get('/profile', Auth, isSuperAdmin, async (req, res) => {
    try {
        const SuperAdminDataNew = await SuperAdmin.findById(req.user.id);
        if (!SuperAdminDataNew) {
            return res.status(400).json({ status: false, message: "User not found" });
        }
        const SuperAdminData = {
            id: SuperAdminDataNew._id,
            firstName: SuperAdminDataNew.firstName,
            lastName: SuperAdminDataNew.lastName,
            email: SuperAdminDataNew.email,
            phoneNumber: SuperAdminDataNew.phoneNumber,
            role: SuperAdminDataNew.role,
            createdAt: SuperAdminDataNew.createdAt,
        };
        res.status(200).json({ status: true, data: SuperAdminData });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

router.post('/create-sub-admin', Auth, isSuperAdmin, async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password } = req.body;
        if (!firstName || !lastName || !email || !phoneNumber || !password) return res.status(400).json({ status: false, message: "All fields are required" });
        const existingSubAdmin = await SubAdmin.findOne({ email });
        if (existingSubAdmin) return res.status(400).json({ status: false, message: "Email already registred" });
         const existingSubAdminPhone = await SubAdmin.findOne({ phoneNumber });
        if (existingSubAdminPhone) return res.status(400).json({ status: false, message: "Phone Number already registred" });
        const hashPassword = await bcrypt.hash(password, 10);
        const newSubAdmin = new SubAdmin({ firstName, lastName, email, phoneNumber, password: hashPassword });
        await newSubAdmin.save();
        res.status(201).json({ status: true, message: "Sub Admin Created Successfully", data: newSubAdmin });
    }
    catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong", error: error.message });
    }
})

router.get('/get-sub-admin', async (req, res) => {
    try {
        const getSubAdmin = await SubAdmin.find({}).sort({ createdAt: -1 });
        res.status(200).json({ status: true, message: "Sub Admin Data fetched", data: getSubAdmin });
        console.log("data sub Admin", getSubAdmin);
    }
    catch (error) {
        res.status(400).json({ status: false, message: "something went wrong !!!", error: error.message });
    }
})

router.get('/create-sub-admin/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const response = await SubAdmin.findById(id).select("-password");
        if (!response) return res.status(404).json({ status: false, message: "Sub Admin not found" });
        res.status(200).json({ status: true, message: "Sub Admin fetched successfully !", data: response })
    }
    catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong", error: error.message });
    }
})

router.put('/create-sub-admin/:id', Auth, isSuperAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const data = { ...req.body };
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const response = await SubAdmin.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        res.status(200).json({ status: true, message: "Sub Admin updated successfully !", data: response })
    }
    catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong", error: error.message });
    }
})

router.delete('/get-sub-admin/:id', Auth, isSuperAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const deletedSubADmin = await SubAdmin.findByIdAndDelete(id);
        res.status(200).json({ status: true, message: "Sub Admin Deleted", data: deletedSubADmin });
    }
    catch (error) {
        res.status(400).json({ status: false, message: "something went wrong !!!", error: error.message });
    }
})

module.exports = router; 