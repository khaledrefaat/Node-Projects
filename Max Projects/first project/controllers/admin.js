const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const { prodId } = req.params;
  if (!editMode) {
    return res.redirect('/');
  }
  Product.findById(prodId, product => {
    if (!product) res.redirect('/');
    res.render('admin/edit-product', {
      docTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  const updatedProduct = new Product(
    productId,
    title,
    imageUrl,
    price,
    description
  );
  updatedProduct.save();
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      docTitle: 'Admin Products',
      path: '/admin/products',
      products,
    });
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(null, title, imageUrl, price, description);
  product
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId);
  res.redirect('/admin/products');
};
