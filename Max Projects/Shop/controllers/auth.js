const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    docTitle: 'Login',
    path: '/login',
    errorMessage: req.flash('error'),
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid Email.');
        return res.redirect('/login');
      }

      return bcrypt.compare(password, user.password).then(result => {
        if (!result) {
          req.flash('error', 'Invalid Password.');
          return res.redirect('/login');
        }

        req.session.isLoggedin = true;
        req.session.user = user;
        return req.session.save(err => {
          console.log(err);
          res.redirect('/');
        });
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
    errorMessage: req.flash('error'),
  });
};

exports.postSignUp = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  User.findOne({ email: email })
    .then(user => {
      if (password !== confirmPassword) {
        req.flash('error', 'Password confirmation does not match password.');
        return res.redirect('/signup');
      }

      if (user) {
        req.flash('error', 'Email already exists.');
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
