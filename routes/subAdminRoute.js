const express = require('express');
const { SubAdmin } = require('../models/subAdmin.model');
const Auth = require('../middleware/authMiddleWare');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET_KEY;

router.get('/profile', Auth, async (req, res) => {
    try {
        const SubAdminDataNew = await SubAdmin.findById(req.user.id);
        if (!SubAdminDataNew) {
            return res.status(400).json({ status: false, message: "Sub Admin not found" });
        }
        const SubAdminData = {
            id: SubAdminDataNew?._id,
            firstName: SubAdminDataNew?.firstName,
            lastName: SubAdminDataNew?.lastName,
            email: SubAdminDataNew?.email,
            phoneNumber: SubAdminDataNew?.phoneNumber,
            role: SubAdminDataNew?.role,
            created: SubAdminDataNew?.createdAt,
        };
        res.status(200).json({ status: true, data: SubAdminData });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

module.exports = router;