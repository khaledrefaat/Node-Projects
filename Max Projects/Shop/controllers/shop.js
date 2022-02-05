const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');

// helper functions

const renderPage = (res, req, file, products, docTitle, path) => {
  return res.render(file, {
    docTitle,
    path,
    products,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getIndex = (req, res, next) => {
  return Product.find()
    .then(products => {
      console.log(products);
      return renderPage(res, req, 'shop/index', products, 'Shop', '/');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products =>
      renderPage(
        res,
        req,
        'shop/product-list',
        products,
        'Products',
        '/products'
      )
    )
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then(product =>
      res.render('shop/product-detail', {
        docTitle: product.title,
        path: '/product',
        product,
        isAuthenticated: req.session.isLoggedIn,
      })
    )
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId').then(user => {
    renderPage(res, req, 'shop/cart', user.cart.items, 'Cart', '/cart');
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then(product => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .removeFromCart(productId)
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc },
        };
      });

      const order = new Order({
        products: products,
        user: {
          userId: req.user._id,
          name: req.user.name,
        },
      });
      order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id }).then(orders => {
    let total = 0;

    // this is so bad it's n^2 code
    orders.forEach(prod => {
      return prod.products.forEach(p => {
        return (total += p.quantity * p.product.price);
      });
    });

    orders.total = total.toFixed(2);

    res.render('shop/orders', {
      docTitle: 'Orders',
      path: '/orders',
      orders,
    });
  });
};

exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;

  return Order.findById(orderId)
    .populate('user')
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (req.user._id.toString() !== order.user.userId.toString()) {
        return next(new Error('UnAuthorized'));
      }
      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join('data', 'invoices', invoiceName);

      fs.readFile(invoicePath, (err, data) => {
        if (err) {
          next(err);
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `inline; filename="${invoiceName}"`
        );

        res.send(data);
      });
    });
};
