const express = require('express');
const router = express.Router();

const {
  getSignup,
  getLogin,
  postLogin,
  postSignUp,
  postLogout,
} = require('../controllers/auth');

router.get('/signup', getSignup);

router.post('/signup', postSignUp);

router.post('/login', postLogin);

router.post('/logout', postLogout);

router.get('/login', getLogin);

module.exports = router;
