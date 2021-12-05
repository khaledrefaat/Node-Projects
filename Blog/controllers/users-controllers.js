const User = require('../models/user');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let exsistingUser;
  try {
    exsistingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('loging in failed, Please try again later.', 500)
    );
  }

  if (!exsistingUser) return next(new HttpError('Incorrect Email.', 401));

  if (exsistingUser.password !== password)
    return next(new HttpError('Incorrect Password.', 401));

  let token;
  try {
    token = jwt.sign(
      {
        userId: exsistingUser._id,
        userEmail: exsistingUser.email,
      },
      'Super_Secret_Dont_Share',
      { expiresIn: '1h' }
    );
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('loging in failed, Please try again later.', 500)
    );
  }
  res.json({ userId: exsistingUser._id, email: exsistingUser.email, token });
};

exports.signUp = async (req, res, next) => {
  const validationErrorResult = validationResult(req);
  if (!validationErrorResult.isEmpty())
    return next(new HttpError('Invalid Inputs!', 422));

  const { username, email, password, passwordConfirmation } = req.body;

  if (password !== passwordConfirmation)
    return next(
      new HttpError('Password confirmation does not match password', 422)
    );

  let exsistingUser;
  try {
    exsistingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Signing up failed, Please try again later.', 500)
    );
  }

  if (exsistingUser)
    return next(
      new HttpError('User already exists, please login instead', 422)
    );

  const createdUser = new User({
    username,
    email,
    password,
    articles: [],
  });
  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Signing up failed, Please try again later.', 500)
    );
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser._id,
        email: createdUser.email,
      },
      'Super_Secret_Dont_Share',
      { expiresIn: '1h' }
    );
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Signing up failed, Please try again later.', 500)
    );
  }

  res.json({ userId: createdUser._id, email: createdUser.email, token });
};
