const express = require('express');
const path = require('path');
const User = require('./models/user');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
// const { mongoCofnnect } = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const routerAdmin = require('./routes/admin');
const routerShop = require('./routes/shop');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('6198dc989783e6f737ac2508')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', routerAdmin);
app.use(routerShop);
app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://khaledrefaat:5214705@cluster0.nos6l.mongodb.net/shop?authSource=admin&replicaSet=atlas-mlj2fm-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
  )
  .then(result => {
    app.listen(3000);
  })
  .catch(err => console.log(err));
