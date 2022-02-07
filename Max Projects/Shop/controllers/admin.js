const Product = require('../models/product');
const { validationResult } = require('express-validator');
const fileHelper = require('../util/file');

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
    .catch(err =>
      returnError(next, 'Something went wrong, please try again later.')
    );
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
      price: '',
      description: '',
    },
  });
};

exports.postAddProduct = (req, res, next) => {
  const validationErrors = validationResult(req);
  const image = req.file;
  const { title, price, description } = req.body;

  if (!validationErrors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      docTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
      validationErrors: validationErrors.array(),
      errorMessage: validationErrors.array()[0].msg,
      oldInputs: {
        title,
        price,
        description,
      },
    });
  }

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      docTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
      validationErrors: validationErrors.array(),
      errorMessage: 'Please select valid image',
      oldInputs: {
        title,
        price,
        description,
      },
    });
  }

  const product = new Product({
    title,
    price,
    description,
    image: image.path,
    userId: req.user._id,
  });
  product
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch(err =>
      returnError(next, 'Adding product failed, please try again later.')
    );
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
    .catch(err =>
      returnError(next, 'Something went wrong, please try again later.')
    );
};

exports.postEditProduct = (req, res, next) => {
  const image = req.file;
  const { productId, title, price, description } = req.body;
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
      if (image) {
        fileHelper.deleteFile(product.image);
        product.image = image.path;
      }
      product.description = description;
      product.save();
    })
    .then(() => res.redirect('/admin/products'))
    .catch(err =>
      returnError(next, 'Updating product failed, please try again later.')
    );
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  return Product.findOne({ _id: productId, userId: req.user._id })
    .then(product => {
      if (!product) {
        returnError(next, 'Product was not Found.');
      }
      fileHelper.deleteFile(product.image);
      product.remove().then(() => res.redirect('/admin/products'));
    })
    .catch(err =>
      returnError(next, 'Deleting product failed, please try again later.')
    );

  // Product.deleteOne({ _id: productId, userId: req.user._id })
  //   .then(() => res.redirect('/admin/products'))
  //   .catch(err => returnError(next, err));
};
