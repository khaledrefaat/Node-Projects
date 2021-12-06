const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

const { signUp, login, getUsers } = require('../controllers/users-controllers');

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

router.use(checkAuth);

router.get('/', getUsers);

module.exports = router;
