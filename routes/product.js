const express = require('express');
const router = express.Router();
const { isAuthenticated, isSeller } = require('../middlewares/auth');
const upload = require('../utils/fileUpload');

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

            return res.status(200).json({
                status: 'ok',
                productDetails,
            });
        });
    } catch (e) {
        console.log('Error post product : ', e);
        res.status(500).send(e);
    }
});

module.exports = router;
