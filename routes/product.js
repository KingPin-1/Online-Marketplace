const express = require('express');
const router = express.Router();
const { isAuthenticated, isSeller } = require('../middlewares/auth');
const upload = require('../utils/fileUpload');
const Product = require('../models/productModel');

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

module.exports = router;
