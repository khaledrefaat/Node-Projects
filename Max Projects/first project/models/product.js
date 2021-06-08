const path = require('path');
const fs = require('fs');

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
  constructor(t) {
    this.title = t;
  }

  save() {
    fs.readFile(p, (err, fileContent) => {
      getProductFromFile(products => {
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      });
    });
  }

  static fetchAll(cb) {
    getProductFromFile(cb);
  }
};
