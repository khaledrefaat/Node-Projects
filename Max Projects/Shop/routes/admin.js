const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

const {
  getAddProduct,
  getEditProduct,
  postEditProduct,
  postAddProduct,
  getProducts,
  postDeleteProduct,
} = require('../controllers/admin');

router.get('/add-product', isAuth, getAddProduct);

router.get('/edit-product/:prodId', isAuth, getEditProduct);

router.post('/edit-product', isAuth, postEditProduct);

router.post('/add-product', isAuth, postAddProduct);

router.get('/products', isAuth, getProducts);

router.post('/delete-product', isAuth, postDeleteProduct);

module.exports = router;
