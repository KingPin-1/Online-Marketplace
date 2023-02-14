const express = require('express');
const router = express.Router();
const { isAuthenticated, isSeller } = require('../middlewares/auth');

router.post('/create', isAuthenticated, isSeller, (req, res) => {
    try {
        
    } catch (e) {
        console.log('Error post product : ', e);
        res.status(500).send(e);
    }
});

module.exports = router;
