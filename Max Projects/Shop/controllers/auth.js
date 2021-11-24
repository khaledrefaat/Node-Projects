const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    docTitle: 'Login',
    path: '/login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .then(user => {
      return bcrypt.compare(password, user.password).then(result => {
        if (user && result) {
          req.session.isLoggedin = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
        }
        req.isLoggedin = false;
        return res.redirect('/login');
      });
    })
    .catch(err => {
      console.log(err);
      return res.redirect('/login');
    });
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
    isAuthenticated: false,
  });
};

exports.postSignUp = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  User.findOne({ email: email })
    .then(user => {
      if (password !== confirmPassword || user) {
        return res.redirect('/signup');
      }

      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email,
            password: hashedPassword,
            name,
            cart: { items: [] },
          });
          return user
            .save()
            .then(() => {
              req.session.isLoggedin = true;
              req.session.user = user;
              req.session.save(err => {
                console.log(err);
                return res.redirect('/signup');
              });
            })
            .catch(err => {
              console.log(err);
              return res.redirect('/signup');
            });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};
