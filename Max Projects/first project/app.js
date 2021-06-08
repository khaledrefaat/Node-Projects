const express = require('express');
const path = require('path');

const routerAdmin = require('./routes/admin');
const routerShop = require('./routes/shop');
const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', routerAdmin);
app.use(routerShop);
app.use(errorController.get404);

app.listen(9000);
