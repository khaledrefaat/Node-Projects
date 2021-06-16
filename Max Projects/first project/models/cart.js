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
};
