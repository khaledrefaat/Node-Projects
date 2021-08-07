const express = require('express');
const path = require('path');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// const routerAdmin = require('./routes/admin');
// const routerShop = require('./routes/shop');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then(user => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch(err => console.log(err));
});

// app.use('/admin', routerAdmin);
// app.use(routerShop);
app.use(errorController.get404);

mongoConnect(client => {
  console.log(client);
  app.listen(9000);
});
