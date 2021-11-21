const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        products,
        docTitle: 'Shop',
        path: '/',
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        docTitle: 'Products',
        path: '/products',
        products,
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        docTitle: product.title,
        path: '/product',
        product,
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(products => {
      res.render('shop/cart', {
        docTitle: 'Cart',
        path: '/cart',
        products: products.cart.items,
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .removeFromCart(productId)
    .then(result => res.redirect('/cart'))
    .catch(err => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     docTitle: 'Check out',
//     path: '/checkout',
//   });
// };

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(products => {
      const order = new Order({
        items: products.cart.items,
        user: {
          userId: products._id,
          name: products.name,
        },
      });
      order.save();
      req.user.clearCart();
    })
    .then(result => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  // req.user
  //   .getOrders()
  //   .then(orders => {
  //     res.render('shop/orders', {
  //       docTitle: 'Orders',
  //       path: '/orders',
  //       orders,
  //     });
  //   })
  //   .catch(err => console.log(err));

  Order.find()
    .populate('items.productId')
    .then(orders => {
      res.render('shop/orders', {
        docTitle: 'Orders',
        path: '/orders',
        orders,
      });
    });
};

exports.getSignup = (req, res, next) => {
  res.render('shop/signup', {
    docTitle: 'Sign Up',
    path: '/signup',
  });
};
