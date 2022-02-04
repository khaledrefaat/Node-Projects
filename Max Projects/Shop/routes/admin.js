const express = require('express');

const router = express.Router();
const Product = require('../models/product');

const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator');

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

router.post(
  '/edit-product',
  isAuth,
  [
    body('productId').custom(value => {
      return Product.findById(value).then(product => {
        if (!product) {
          return Promise.reject(
            'Editing product failed, please try again later.'
          );
        }
      });
    }),
    body('title')
      .isAlphanumeric('en-US', { ignore: 's' })
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl').isURL().trim(),
    body('price').not().isEmpty().isFloat(),
    body('description').isLength({ min: 10, max: 400 }).trim(),
  ],
  postEditProduct
);

router.post(
  '/add-product',
  isAuth,
  [
    body('title')
      .isAlphanumeric('en-US', { ignore: 's' })
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl').isURL().trim(),
    body('price').not().isEmpty().isFloat(),
    body('description').isLength({ min: 10, max: 400 }).trim(),
  ],
  postAddProduct
);

router.get('/products', isAuth, getProducts);

router.post('/delete-product', isAuth, postDeleteProduct);

module.exports = router;
