// const Product = require('../models/product');
// const { ObjectId } = require('mongodb');
// const User = require('../models/user');

// exports.getAddProduct = (req, res, next) => {
//   res.render('admin/edit-product', {
//     docTitle: 'Add Product',
//     path: '/admin/add-product',
//     editing: false,
//   });
// };

// exports.postAddProduct = (req, res, next) => {
//   const { title, imageUrl, price, description } = req.body;

//   const product = new Product(
//     title,
//     imageUrl,
//     price,
//     description,
//     null,
//     req.user._id
//   );

//   product
//     .save()
//     .then(result => {
//       res.redirect('/admin/products');
//     })
//     .catch(err => console.log(err));
// };

// exports.getProducts = (req, res, next) => {
//   Product.fetchAll()
//     .then(products => {
//       res.render('admin/products', {
//         docTitle: 'Admin Products',
//         path: '/admin/products',
//         products,
//       });
//     })
//     .catch(err => console.log(err));
// };

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   const { prodId } = req.params;
//   if (!editMode) {
//     return res.redirect('/');
//   }
//   Product.findById(prodId)
//     .then(product => {
//       if (!product) res.redirect('/');
//       res.render('admin/edit-product', {
//         docTitle: 'Edit Product',
//         path: '/admin/edit-product',
//         editing: editMode,
//         product,
//       });
//     })
//     .catch(err => console.log(err));
// };

// exports.postEditProduct = (req, res, next) => {
//   const { productId, title, imageUrl, price, description } = req.body;
//   const product = new Product(
//     title,
//     imageUrl,
//     price,
//     description,
//     new ObjectId(productId)
//   );
//   product
//     .save()
//     .then(() => {
//       console.log('Product Updated ^_^');
//       res.redirect('/admin/products');
//     })
//     .catch(err => console.log(err));
// };

// exports.postDeleteProduct = (req, res, next) => {
//   const { productId } = req.body;
//   Product.deleteById(productId)
//     .then(() => {
//       res.redirect('/admin/products');
//     })
//     .catch(err => console.log(err));
// };

// exports.signUp = (req, res, next) => {
//   const { username, email, password } = req.body;

//   const user = new User(username, email, password);

//   user
//     .save()
//     .then(() => console.log('Created User Complete ^_^'))
//     .catch(err => console.log(err));
//   next();
// };
