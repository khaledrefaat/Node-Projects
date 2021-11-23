const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    docTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session.isLoggedin,
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (user && user.password === password) {
    req.session.isLoggedin = true;
    req.session.user = user;
    req.session.save(err => {
      console.log(err);
      res.redirect('/');
    });
  } else {
    req.isLoggedin = false;
    res.redirect('/login');
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    docTitle: 'Sign Up',
    path: '/signup',
    isAuthenticated: req.session.isLoggedin,
  });
};

exports.postSignUp = (req, res, next) => {
  const { name, email, password } = req.body;

  const user = new User({ email, password, name, cart: { items: [] } });
  user
    .save()
    .then(() => {
      console.log('Created User Complete ^_^');
      res.redirect('/');
    })
    .catch(err => console.log(err));
};
