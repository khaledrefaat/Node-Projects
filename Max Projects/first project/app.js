const express = require('express');
const path = require('path');
const errorController = require('./controllers/error');

const app = express();

const sequelize = require('./util/database');

app.set('view engine', 'ejs');
app.set('views', 'views');

const routerAdmin = require('./routes/admin');
const routerShop = require('./routes/shop');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', routerAdmin);
app.use(routerShop);
app.use(errorController.get404);

sequelize
  .sync()

  .then(result => {
    app.listen(9000);
  })
  .catch(err => console.log(err));
