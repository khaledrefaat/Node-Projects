const express = require('express');
const router = express.Router();

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

router.post('/signup', postSignUp);

router.post('/login', postLogin);

router.post('/logout', postLogout);

router.get('/login', getLogin);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.get('/new-password/:token', getNewPassword);

router.post('/new-password', postNewPassword);

module.exports = router;
