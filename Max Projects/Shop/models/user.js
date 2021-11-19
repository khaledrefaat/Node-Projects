const { getDb } = require('../util/database');
const { ObjectId } = require('mongodb');

class User {
  constructor(username, email, password, cart, id) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    // console.log(product);
    const cartProductIndex = this.cart.items.findIndex(cp => {
      console.log(cp);
      return cp.productId.toString() == product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItem = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItem[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItem.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItem,
    };
    const db = getDb();

    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();

    const productIds = this.cart.items.map(i => i.productId);
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products =>
        products.map(prod => {
          return {
            ...prod,
            quantity: this.cart.items.find(
              i => i.productId.toString() === prod._id.toString()
            ).quantity,
          };
        })
      )
      .catch(err => console.log(err));
  }

  deleteCartItem(id) {
    const updatedCartItem = this.cart.items.filter(
      cartItem => cartItem.productId.toString() !== id.toString()
    );

    return getDb()
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItem } } }
      );
  }

  addOrder() {
    const db = getDb();
    return db
      .collection('orders')
      .insertOne(this.cart)
      .then(result => {
        this.cart = { items: [] };
        db.collection('users').updateOne(
          { _id: new ObjectId(this._id) },
          { $set: { cart: this.cart } }
        );
      })
      .catch(err => console.timeLog(err));
  }

  static findById(id) {
    return getDb()
      .collection('users')
      .findOne({ _id: new ObjectId(id) })
      .then(user => user)
      .catch(err => console.log(err));
  }
}

module.exports = User;
