require('dotenv').config();
const express = require('express');
const router = express.Router();
const { isAuthenticated, isSeller, isBuyer } = require('../middlewares/auth');
const upload = require('../utils/fileUpload');
const Product = require('../models/productModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');

router.post('/create', isAuthenticated, isSeller, (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.log('Error while Uploading ... ', err);
                return res.status(500).send(err);
            }

            const { name, price } = req.body;
            if (!name || !price || !req.file) {
                return res.status(400).json({
                    err: 'File, Name and Price are required fields!!!',
                });
            }

            if (Number.isNaN(price)) {
                return res.status(400).json({
                    err: 'Price should be a number!!!',
                });
            }

            let productDetails = {
                name,
                price,
                content: req.file.path,
            };

            // save in products table
            const savedProduct = await Product.create(productDetails);

            return res.status(200).json({
                status: 'ok',
                savedProduct,
            });
        });
    } catch (e) {
        console.log('Error post product : ', e);
        res.status(500).send(e);
    }
});

// Fetch all Products
router.get('/get/all', isAuthenticated, async (req, res) => {
    try {
        const products = await Product.findAll();
        return res.status(200).json({
            products,
        });
    } catch (e) {
        return res.status(500).json({
            err: e,
        });
    }
});

// BUY API CALL --> Stripe Integrated here
router.post('/buy/:productId', isAuthenticated, isBuyer, async (req, res) => {
    try {
        const productId = req.params.productId;
        let product = await Product.findOne({
            where: {
                id: productId,
            },
        });
        product = product?.dataValues;
        if (!product) {
            return res.status(404).json({
                err: `Product with ID : ${productId} not found!!`,
            });
        }

        // Data to save in order table
        const orderDetails = {
            productId,
            buyerId: req.user.id,
        };

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: '4242424242424242',
                exp_month: 9,
                exp_year: 2023,
                cvc: '314',
            },
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: product.price,
            currency: 'inr',
            payment_method_types: ['card'],
            payment_method: paymentMethod.id,
            confirm: true,
        });

        if (paymentIntent) {
            const createOrder = await Order.create(orderDetails);
            return res.status(200).json({
                createOrder,
            });
        } else {
            return res.status(400).json({
                error: 'Payment Failed',
            });
        }
    } catch (e) {
        console.log('Error while buying ==> ', e);
        return res.status(500).json({
            err: e,
        });
    }
});

module.exports = router;
