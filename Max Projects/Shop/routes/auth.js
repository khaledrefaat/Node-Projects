const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { body } = require('express-validator');

const {
  getSignup,
  getLogin,
  postLogin,
  postSignUp,
  postLogout,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require('../controllers/auth');

router.get('/signup', getSignup);

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email.')
      .custom(value => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject(
              'Email already exists, Please pick different one.'
            );
          }
        });
      }),
    body('password', 'Password should be at least 6 chars')
      .isLength({
        min: 6,
      })
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords must match.');
        }
        return true;
      }),
    body('name').not().isEmpty(),
  ],
  postSignUp
);

router.post(
  '/login',
  [body('email').normalizeEmail(), body('password').trim()],
  postLogin
);

router.post('/logout', postLogout);

router.get('/login', getLogin);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.get('/new-password/:token', getNewPassword);

router.post('/new-password', postNewPassword);

module.exports = router;
