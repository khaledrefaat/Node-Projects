const Product = require('../models/product');
// const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
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
  Product.fetchAll()
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
    .getCart()
    .then(products => {
      res.render('shop/cart', {
        docTitle: 'Cart',
        path: '/cart',
        products,
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

  //   let fetchedCart;
  //   let newQuantity = 1;

  //   req.user
  //     .getCart()
  //     .then(cart => {
  //       fetchedCart = cart;
  //       return cart.getProducts({ where: { id: productId } });
  //     })
  //     .then(products => {
  //       let product;
  //       if (products.length > 0) product = products[0];
  //       if (product) {
  //         const oldQuantity = product.cartItem.quantity;
  //         newQuantity = oldQuantity + 1;
  //         return product;
  //       }
  //       return Product.findByPk(productId);
  //     })
  //     .then(product =>
  //       fetchedCart.addProduct(product, {
  //         through: { quantity: newQuantity },
  //       })
  //     )
  //     .then(() => res.redirect('/cart'))
  //     .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .deleteCartItem(productId)
    .then(result => res.redirect('/cart'))
    .catch(err => console.log(err));
  // req.user
  //   .getCart()
  //   .then(cart => cart.getProducts({ where: { id: productId } }))
  //   .then(products => {
  //     const product = products[0];
  //     return product.cartItem.destroy();
  //   })
  //   .then(res.redirect('/cart'))
  //   .catch(err => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     docTitle: 'Check out',
//     path: '/checkout',
//   });
// };

exports.postOrder = (req, res, next) => {
  // let fetchedCart;
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     fetchedCart = cart;
  //     return cart.getProducts();
  //   })
  //   .then(products => {
  //     return req.user
  //       .createOrder()
  //       .then(order => {
  //         return order.addProducts(
  //           products.map(product => {
  //             product.orderItem = { quantity: product.cartItem.quantity };
  //             return product;
  //           })
  //         );
  //       })
  //       .catch(err => console.log(err));
  //   })
  //   .then(() => fetchedCart.setProducts(null))
  //   .then(() => res.redirect('/orders'))
  //   .catch(err => console.log(err));

  req.user.addOrder().then(result => res.redirect('/cart'));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        docTitle: 'Orders',
        path: '/orders',
        orders,
      });
    })
    .catch(err => console.log(err));
};
