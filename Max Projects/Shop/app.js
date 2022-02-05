const express = require('express');
const path = require('path');
const User = require('./models/user');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const csrf = require('csurf');
const flash = require('connect-flash');
const keys = require('./config/keys');
const { nanoid } = require('nanoid');

const errorController = require('./controllers/error');

const MONGODB_URI = keys.mongoUri;

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const routerAdmin = require('./routes/admin');
const routerShop = require('./routes/shop');
const routerAuth = require('./routes/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, { mimetype }, cb) => {
    cb(null, `${nanoid()}.${mimetype.split('/')[1]}`);
  },
});

const fileFilter = (req, file, cb) => {
  const type = file.mimetype;
  if (type === 'image/png' || type === 'image/jpg' || type === 'image/jpeg') {
    return cb(null, true);
  }
  return cb(null, false);
};

app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage, fileFilter }).single('image'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'My Very Secret Secret',
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', routerAdmin);

app.use(routerShop);

app.use(routerAuth);

app.use('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => res.redirect('/500'));

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => console.log(err));
