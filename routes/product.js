require('dotenv').config();
const express = require('express');
const router = express.Router();
const { isAuthenticated, isSeller, isBuyer } = require('../middlewares/auth');
const upload = require('../utils/fileUpload');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { WebhookClient } = require('discord.js');

const webhook = new WebhookClient({
    url: 'https://discord.com/api/webhooks/1075806815150952578/vBktvsM4JD_R4MaKayKPORiLo74CU8sFptqaV3hExE3Yf4DXeph2bMJNLM4vc1iJ11Xl',
});

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
            webhook.send({
                content: `alert!!! \nNew order placed with id : ${createOrder.id}`,
                username: 'Cute-Order-Manager-Bot',
                avatarURL:
                    'https://cdn-icons-png.flaticon.com/512/924/924915.png',
            });
            return res.status(200).json({
                createOrder,
            });
        } else {
            webhook.send({
                content: `alert!!! \nFailed to place order for details : ${orderDetails}`,
                username: 'Cute-Order-Manager-Bot',
                avatarURL:
                    'https://cdn-icons-png.flaticon.com/512/924/924915.png',
            });
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
