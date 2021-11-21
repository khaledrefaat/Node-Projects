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

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     docTitle: 'Check out',
//     path: '/checkout',
//   });
// };

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
  Order.find().then(orders => {
    let total = 0;

    // this is so bad it's n^2 code
    orders.forEach(prod => {
      return prod.products.forEach(p => {
        return (total += p.quantity * p.product.price);
      });
    });

    orders.total = total;

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
