const Product = require('../models/product');
const User = require('../models/user');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
  });

  product
    .save()
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('admin/products', {
        docTitle: 'Admin Products',
        path: '/admin/products',
        products,
      });
    })
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const { prodId } = req.params;

  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  Product.findById(prodId)
    .then(product => {
      if (!product) res.redirect('/');
      res.render('admin/edit-product', {
        docTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;

  Product.findById(productId)
    .then(product => {
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
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.findByIdAndRemove(productId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.signUp = (req, res, next) => {
  const { name, email, password } = req.body;

  const user = new User({ email, password, name });

  user
    .save()
    .then(() => {
      console.log('Created User Complete ^_^');
      res.redirect('/');
    })
    .catch(err => console.log(err));
};
