const express = require('express');
const path = require('path');

const productsController = require('../controllers/products');

const router = express.Router();

router.get('/', productsController.getProduct);

module.exports = router;
