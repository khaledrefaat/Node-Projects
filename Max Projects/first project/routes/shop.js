const express = require('express');
const path = require('path');

const productsController = require('../controllers/shop');

const router = express.Router();

router.get('/', productsController.getProduct);

router.get('/products', productsController.getProducts);

router.get('/cart', productsController.getCart);

router.get('/checkout', productsController.getCheckout);

module.exports = router;
