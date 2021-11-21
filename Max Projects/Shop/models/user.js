const mongoose = require('mongoose');
const Product = require('./product');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  // console.log(product);
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() == product._id.toString();
  });

  let newQuantity = 1;
  const updatedCartItem = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItem[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItem.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItem,
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (id) {
  const updatedCartItem = this.cart.items.filter(
    cartItem => cartItem.productId.toString() !== id.toString()
  );

  this.cart.items = updatedCartItem;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

// const { getDb } = require('../util/database');
// const { ObjectId } = require('mongodb');

// class User {
//   constructor(username, email, password, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.password = password;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection('users').insertOne(this);
//   }

//   getCart() {
//     const db = getDb();

//     const productIds = this.cart.items.map(i => i.productId);
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products =>
//         products.map(prod => {
//           return {
//             ...prod,
//             quantity: this.cart.items.find(
//               i => i.productId.toString() === prod._id.toString()
//             ).quantity,
//           };
//         })
//       )
//       .catch(err => console.log(err));
//   }

//   addOrder() {
//     const db = getDb();

//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.username,
//           },
//         };
//         return db
//           .collection('orders')
//           .insertOne(order)
//           .catch(err => console.timeLog(err));
//       })
//       .then(result => {
//         this.cart = { items: [] };
//         db.collection('users').updateOne(
//           { _id: new ObjectId(this._id) },
//           { $set: { cart: this.cart } }
//         );
//       });
//   }

//   getOrders() {
//     return getDb()
//       .collection('orders')
//       .find()
//       .toArray()
//       .then(orders => orders)
//       .catch(err => console.log(err));
//   }

//   static findById(id) {
//     return getDb()
//       .collection('users')
//       .findOne({ _id: new ObjectId(id) })
//       .then(user => user)
//       .catch(err => console.log(err));
//   }
// }

// module.exports = User;
