const express = require('express');
const path = require('path');

const routerAdmin = require('./routes/admin');
const routerShop = require('./routes/shop');
const expressHbs = require('express-handlebars');

const app = express();

app.engine(
  'hbs',
  expressHbs({
    extname: 'hbs',
    defaultLayout: 'main-layout',
    layoutsDir: 'views/layouts/',
  })
);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', routerAdmin.routes);
app.use(routerShop);
app.use((req, res, next) => {
  res.status(404).render('404', { docTitle: 'Page Not Found' });
});

app.listen(9000);
