const express = require('express');
const path = require('path');
const errorController = require('./controllers/error');

const app = express();

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

const routerAdmin = require('./routes/admin');
const routerShop = require('./routes/shop');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', routerAdmin);
app.use(routerShop);
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
  .sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      console.log('there is no user ------------------------------------');
      return User.create({
        email: 'test@test.com',
        userName: 'khaledrefaat',
      });
    }
    return user;
  })
  .then(user => {
    app.listen(9000);
  })
  .catch(err => console.log(err));
