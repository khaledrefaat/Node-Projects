const express = require('express');

const path = require('path');

const router = express.Router();

const productsController = require('../controllers/admin');

router.get('/add-product', productsController.getAddProduct);

router.post('/add-product', productsController.postAddProduct);

router.get('/products', productsController.getProducts);

module.exports = router;
