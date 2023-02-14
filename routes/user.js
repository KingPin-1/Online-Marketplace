const express = require('express');
const router = express.Router();
const { Users } = require('../models/userModel');
const bcrypt = require('bcrypt');

const {
    validateName,
    validateEmail,
    validatePassword,
} = require('../utils/validators');

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, isSeller } = req.body;
        const existingUser = await Users.findOne({ where: { email } });

        if (existingUser) {
            return res.status(403).json({ err: "User Already Exists!!'" });
        }

        if (!validateName(name)) {
            return res.status(403).json({ err: 'Invalid Name' });
        }

        if (!validateEmail(email)) {
            return res.status(403).json({ err: 'Invalid Email' });
        }

        if (!validatePassword(password)) {
            return res.status(403).json({ err: 'InvalidPassword' });
        }

        // 10 is the salt ... salt appended to the password to generate stronger hash
        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = {
            name,
            email,
            isSeller,
            password: hashedPass,
        };

        const createdUser = await Users.create(newUser);

        return res.status(201).json({
            message: `Created User ${createdUser.name} with email ${createdUser.email} Successfully!!!`,
        });
    } catch (e) {
        console.log('Sign Up Error with message :', e);
        res.status(500).send(e);
    }
});

module.exports = router;
