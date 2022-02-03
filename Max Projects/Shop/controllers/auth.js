const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const keys = require('../config/keys');

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: keys.sendGridKey,
    },
  })
);

exports.getLogin = (req, res, next) =>
  res.render('auth/login', {
    docTitle: 'Login',
    path: '/login',
    errorMessage: req.flash('error')[0] || null,
    oldInputs: {
      email: '',
      password: '',
    },
  });

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  const renderLogin = () =>
    res.render('auth/login', {
      docTitle: 'Login',
      path: '/login',
      errorMessage: req.flash('error')[0] || null,
      oldInputs: {
        email,
        password,
      },
    });

  return User.findOne({ email })

    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid Email.');
        return renderLogin();
      }

      return bcrypt.compare(password, user.password).then(result => {
        if (!result) {
          req.flash('error', 'Invalid Password.');
          return renderLogin();
        }

        req.session.isLoggedIn = true;
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

exports.getSignup = (req, res, next) =>
  res.render('auth/signup', {
    docTitle: 'Sign Up',
    path: '/signup',
    errorMessage: null,
    oldInputs: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
  });

exports.postSignUp = (req, res, next) => {
  const myValidationResult = validationResult(req);
  const { name, email, password, confirmPassword } = req.body;

  console.log(myValidationResult.array());

  if (!myValidationResult.isEmpty()) {
    return res.status(422).render('auth/signup', {
      docTitle: 'Sign Up',
      path: '/signup',
      errorMessage: myValidationResult.array()[0].msg,
      oldInputs: {
        email,
        name,
        password,
        confirmPassword,
      },
      validationErrors: myValidationResult.array(),
    });
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
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save(err => {
            res.redirect('/login');
            return transporter.sendMail({
              to: email,
              from: 'khaledrefaat07@gmail.com',
              subject: 'signup succeeded!!!',
              html: '<h1>You Successfully signed up ^_^</h1>',
            });
          });
        })
        .catch(err => {
          console.log(err);
          return res.redirect('/signup');
        });
    })
    .catch(err => console.log(err));
};

exports.getReset = (req, res, next) =>
  res.render('auth/reset', {
    docTitle: 'Reset',
    path: '/reset',
    errorMessage: req.flash('error')[0] || null,
  });

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    return User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash(
            'error',
            "Error we could'nt find an account with that email."
          );
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        return transporter.sendMail({
          to: req.body.email,
          from: 'khaledrefaat07@gmail.com',
          subject: 'reset password',
          html: `<div><h2>To reset your password please click on this link</h2><a href="http://localhost:3000/new-password/${token}">reset password</a></div>`,
        });
      })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;

  return User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then(user => {
      res.render('auth/new-password', {
        docTitle: 'New Password',
        path: '/new-password',
        errorMessage: returnErrorMessage(req),
        userId: user._id.toString(),
        token,
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const { userId, password, passwordConfirmation, token } = req.body;

  if (password !== passwordConfirmation) {
    req.flash('error', "Password does'nt match password confirmation.");
    return res.redirect('/new-password/' + token);
  }

  User.findById(userId).then(user => {
    return bcrypt
      .compare(password, user.password)
      .then(result => {
        if (result) {
          req.flash('error', 'Please use a new password.');
          return res.redirect('/new-password/' + token);
        }

        return bcrypt
          .hash(password, 12)
          .then(hashedPassword => {
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            return user.save();
          })
          .then(() => res.redirect('/login'));
      })
      .catch(err => console.log(err));
  });
};
