const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { signUp } = require('../controllers/users-controllers');

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
