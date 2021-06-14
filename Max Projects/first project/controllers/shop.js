const Product = require('../models/product');

exports.getProduct = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      products,
      docTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      docTitle: 'Products',
      path: '/products',
      products,
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    docTitle: 'Cart',
    path: '/cart',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    docTitle: 'Check out',
    path: '/checkout',
  });
};
