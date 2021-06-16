const express = require('express');

const path = require('path');

const router = express.Router();

const productsController = require('../controllers/admin');

router.get('/add-product', productsController.getAddProduct);

router.get('/edit-product/:prodId', productsController.getEditProduct);

router.post('/edit-product', productsController.postEditProduct);

router.post('/add-product', productsController.postAddProduct);

router.get('/products', productsController.getProducts);

router.post('/delete-product', productsController.postDeleteProduct);

module.exports = router;
