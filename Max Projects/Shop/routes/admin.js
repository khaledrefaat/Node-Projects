const express = require('express');

const path = require('path');

const router = express.Router();

const {
  getAddProduct,
  getEditProduct,
  postEditProduct,
  postAddProduct,
  getProducts,
  postDeleteProduct,
  signUp,
} = require('../controllers/admin');

// router.get('/add-product', getAddProduct);

// router.get('/edit-product/:prodId', getEditProduct);

// router.post('/edit-product', postEditProduct);

// router.post('/add-product', postAddProduct);

// router.get('/products', getProducts);

// router.post('/delete-product', postDeleteProduct);

// router.post('/signup', signUp);

module.exports = router;
