const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
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

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId, product => {
    res.render('shop/product-detail', {
      docTitle: 'Product',
      path: '/product',
      product,
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

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    docTitle: 'Orders',
    path: '/orders',
  });
};
