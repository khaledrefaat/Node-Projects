const path = require('path');
const fs = require('fs');

const Cart = require('./cart');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
);

const getProductFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) return cb([]);
    cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    fs.readFile(p, (err, fileContent) => {
      getProductFromFile(products => {
        if (this.id) {
          const exsistingProduct = products.findIndex(
            prod => prod.id === this.id
          );
          const updatedProducts = [...products];
          updatedProducts[exsistingProduct] = this;
          fs.writeFile(p, JSON.stringify(updatedProducts), err => {
            console.log(err);
          });
        } else {
          this.id = Math.floor(Math.random() * 100000).toString();
          products.push(this);
          fs.writeFile(p, JSON.stringify(products), err => {
            console.log(err);
          });
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductFromFile(cb);
  }

  static findById(id, cb) {
    getProductFromFile(products => {
      const product = products.find(product => product.id === id);
      cb(product);
    });
  }

  static deleteById(id) {
    getProductFromFile(products => {
      const updatedProducts = products.filter(prod => prod.id !== id);
      const productPrice = products.find(prod => prod.id === id).price;
      console.log(productPrice);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Cart.deleteProductById(id, productPrice);
        }
      });
    });
  }
};
