const express = require('express');

const isAuth = require('../middleware/is-auth');

const {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postCartDeleteProduct,
  postOrder,
  getOrders,
  getInvoice,
} = require('../controllers/shop');

const router = express.Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', isAuth, getCart);

router.post('/cart', isAuth, postCart);

router.post('/cart-delete-item', isAuth, postCartDeleteProduct);

router.post('/create-order', isAuth, postOrder);

router.get('/orders', isAuth, getOrders);

router.get('/orders/:orderId', isAuth, getInvoice);

module.exports = router;
