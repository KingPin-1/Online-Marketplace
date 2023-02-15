const jwt = require('jsonwebtoken');
const { Users } = require('../models/userModel');

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                err: 'Auth headers not found',
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                err: 'Token not found',
            });
        }

        // use secret key to verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // retrieve user through id recovered from token
        const user = await Users.findOne({ where: { id: decoded.user.id } });
        if (!user) {
            return res.status(404).json({
                err: 'User not found!!!',
            });
        }
        // better performance by reducing auth calls for the next middleware function
        // by attaching the fetched user to the main request object common to all middle ware functions of a particular call.
        req.user = user.dataValues;
        // call the next function in middleware sequence
        next();
    } catch (e) {
        return res.status(500).send(e);
    }
};

const isSeller = async (req, res, next) => {
    // no need to retrieve user from token here
    // isSeller() will always be called after isAuthenticated()
    // and that func will retrieve and append user to req object
    // This saves computation here.
    try {
        if (!req.user.isSeller) {
            return res.status(401).json({
                err: `User ${req.user.name} is not a seller!`,
            });
        } else {
            next();
        }
    } catch (e) {
        return res.status(500).send(e);
    }
};

const isBuyer = async (req, res, next) => {
    try {
        if (!req.user.isSeller) {
            next();
        } else {
            return res.status(401).json({
                err: `User ${req.user.name} is not a buyer!`,
            });
        }
    } catch (e) {
        console.log('Error encountered while verifying buyer!!', e);
        return res.status(500).send(e);
    }
};

module.exports = { isAuthenticated, isSeller, isBuyer };
