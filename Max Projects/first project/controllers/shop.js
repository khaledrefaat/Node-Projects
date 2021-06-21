const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
  Product.findAll()
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
  Product.findAll()
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
  Product.findByPk(productId)
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
  Cart.fetchCart(({ products, totalPrice }) => {
    Product.fetchAll(allProducts => {
      const cartProducts = [];
      for (product of allProducts) {
        const cartProductData = products.find(prod => prod.id === product.id);
        if (cartProductData) {
          cartProducts.push({ product, quantity: cartProductData.quantity });
        }
      }
      res.render('shop/cart', {
        docTitle: 'Cart',
        path: '/cart',
        products: cartProducts,
        totalPrice,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, ({ id, price }) => {
    Cart.deleteProductById(id, price);
    res.redirect('/cart');
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
