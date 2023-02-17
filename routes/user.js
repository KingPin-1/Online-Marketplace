const express = require('express');
const router = express.Router();
const { Users } = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middlewares/auth');

const {
    validateName,
    validateEmail,
    validatePassword,
} = require('../utils/validators');

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - name
 *              - email
 *              - password
 *              - isSeller
 *          properties:
 *              id:
 *                  type: INTEGER
 *                  description: The auto-generated id
 *              name:
 *                  type: STRING
 *                  description: Name of User
 *              email:
 *                  type: STRING
 *                  description: Email ID of User
 *              password:
 *                  type: STRING
 *                  description: Password of the User
 *              isSeller:
 *                  type: BOOLEAN
 *                  description: User is seller or not
 *          example:
 *              name: Harsh
 *              email: harsh123@gmail.com
 *              password: Th!s1sWack
 *              isSeller: true
 */

/**
 * @swagger
 * /api/v1/user/signup:
 *  post:
 *      summary: Creates a new User
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          201:
 *              description: The user is successfully created
 *          403:
 *              description: The user already exists
 *          400:
 *              description: Validations Failed
 *          500:
 *              description: Internal Server Error
 */
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, isSeller } = req.body;
        const existingUser = await Users.findOne({ where: { email } });

        if (existingUser) {
            return res.status(403).json({ err: "User Already Exists!!'" });
        }

        if (!validateName(name)) {
            return res.status(400).json({ err: 'Invalid Name' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ err: 'Invalid Email' });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ err: 'InvalidPassword' });
        }

        // 10 is the salt ... salt appended to the password to generate stronger hash
        const hashedPass = await bcrypt.hash(password, (saltOrRounds = 10));

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

/**
 * @swagger
 * /api/v1/user/signin:
 *  post:
 *      summary: Signs In a user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: Successful Login
 *          404:
 *              description: User Not Found
 *          400:
 *              description: Invalid Details
 *          500:
 *              description: Internal Server Error
 */
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email.length === 0) {
            res.status(400).json({
                message: 'Please enter an email',
            });
        }

        if (password.length === 0) {
            res.status(400).json({
                message: 'Enter Password',
            });
        }

        const existingUser = await Users.findOne({ where: { email } });
        if (!existingUser) {
            res.status(404).json({
                message: 'User Not Found!!!',
            });
        }

        const checkPass = await bcrypt.compare(password, existingUser.password);
        if (!checkPass) {
            res.status(400).json({
                message: 'Invalid Email or Password',
            });
        }

        const payload = { user: { id: existingUser.id } };
        const bearerToken = await jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 360000,
        });

        res.cookie('t', bearerToken, {
            expiresIn: new Date() + 9999,
        });

        res.status(200).json({
            message: `Welcome ${existingUser.name}`,
            token: bearerToken,
        });
    } catch (e) {
        console.log('Sign in Error : ', e);
        res.status(500).send(e);
    }
});

router.delete('/signout', isAuthenticated, async (req, res) => {
    try {
        res.clearCookie('t');
        res.status(200).json({
            message: 'Token deleted --> Sign out successful',
        });
    } catch (e) {
        console.log('Error while signing out : ', e);
        res.status(500).send(e);
    }
});

module.exports = router;
