const express = require('express');
const router = express.Router();
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
    body('email', 'Please enter a valid email.').isEmail(),
    body('password', 'Password should be at least 6 chars').isLength({
      min: 6,
    }),
    body('confirmPassword').isLength({ min: 6 }),
    body('name').not().isEmpty(),
  ],
  postSignUp
);

router.post('/login', postLogin);

router.post('/logout', postLogout);

router.get('/login', getLogin);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.get('/new-password/:token', getNewPassword);

router.post('/new-password', postNewPassword);

module.exports = router;
