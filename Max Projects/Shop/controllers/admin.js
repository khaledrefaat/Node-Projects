const Product = require('../models/product');
const { validationResult } = require('express-validator');

const returnError = (next, error) => {
  console.log(error);
  const err = new Error(error);
  err.HttpError = 500;
  return next(err);
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then(products => {
      res.render('admin/products', {
        docTitle: 'Admin Products',
        path: '/admin/products',
        products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => returnError(next, err));
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    validationErrors: [],
    errorMessage: null,
    oldInputs: {
      title: '',
      imageUrl: '',
      price: '',
      description: '',
    },
  });
};

exports.postAddProduct = (req, res, next) => {
  const validationErrors = validationResult(req);
  const { title, imageUrl, price, description } = req.body;

  if (!validationErrors.isEmpty()) {
    res.render('admin/edit-product', {
      docTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
      validationErrors: validationErrors.array(),
      errorMessage: validationErrors.array()[0].msg,
      oldInputs: {
        title,
        imageUrl,
        price,
        description,
      },
    });
  }

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user._id,
  });

  product
    .save()
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => returnError(next, err));
};

exports.getEditProduct = (req, res, next) => {
  const { prodId } = req.params;

  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString())
        return res.redirect('/');
      res.render('admin/edit-product', {
        docTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
        isAuthenticated: req.session.isLoggedIn,
        validationErrors: [],
        errorMessage: null,
      });
    })
    .catch(err => returnError(next, err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  const validationErrors = validationResult(req);

  console.table(validationErrors.array());

  Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString())
        return res.redirect('/');

      if (!validationErrors.isEmpty()) {
        return res.render('admin/edit-product', {
          docTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: true,
          isAuthenticated: req.session.isLoggedIn,
          validationErrors: validationErrors.array(),
          errorMessage: validationErrors.array()[0].msg,
          product,
        });
      }

      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      product.save();
    })
    .then(result => {
      console.log('Product Updated ^_^');
      res.redirect('/admin/products');
    })
    .catch(err => returnError(next, err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => res.redirect('/admin/products'))
    .catch(err => returnError(next, err));
};
