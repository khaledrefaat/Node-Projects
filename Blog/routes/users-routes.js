const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { signUp, login } = require('../controllers/users-controllers');

router.post('/login', login);

router.post(
  '/signup',
  [
    check('username').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
    check('passwordConfirmation').isLength({ min: 6 }),
  ],
  signUp
);

module.exports = router;
