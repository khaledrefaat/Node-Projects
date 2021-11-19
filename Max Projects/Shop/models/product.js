// const { getDb } = require('../util/database');
// const mongoDb = require('mongodb');

// class Product {
//   constructor(title, imageUrl, price, description, id, userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description = description;
//     this._id = id ? new mongoDb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection('products')
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection('products').insertOne(this);
//     }
//     return dbOp;
//   }

//   static fetchAll() {
//     return getDb()
//       .collection('products')
//       .find()
//       .toArray()
//       .then(products => {
//         return products;
//       })
//       .catch(err => console.log(err));
//   }

//   static findById(id) {
//     return getDb()
//       .collection('products')
//       .find({ _id: new mongoDb.ObjectId(id) })
//       .next()
//       .then(product => product)
//       .catch(err => console.log(err));
//   }

//   static deleteById(id) {
//     return getDb()
//       .collection('products')
//       .deleteOne({ _id: mongoDb.ObjectId(id) })
//       .then(result => console.log('Product Deleted -_-'))
//       .catch(err => console.log(err));
//   }
// }

// module.exports = Product;
