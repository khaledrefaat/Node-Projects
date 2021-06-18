const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const exsistingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const exsistingProduct = cart.products[exsistingProductIndex];
      let updatedProduct;
      if (exsistingProduct) {
        updatedProduct = { ...exsistingProduct };
        updatedProduct.quantity = updatedProduct.quantity + 1;
        cart.products = [...cart.products];
        cart.products[exsistingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = Number(cart.totalPrice) + Number(productPrice);
      fs.writeFile(p, JSON.stringify(cart), err => console.log(err));
    });
  }

  static fetchCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) return null;
      cb(JSON.parse(fileContent));
    });
  }

  static deleteProductById = (id, productPrice) => {
    console.log(productPrice);
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        console.log(err);
        return;
      }

      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find(prod => prod.id === id);
      const productQuantity = product.quantity;
      console.log(updatedCart.products);
      updatedCart.products = updatedCart.products.filter(
        prod => prod.id !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQuantity;

      fs.writeFile(p, JSON.stringify(updatedCart), err => console.log(err));
    });
  };
};
