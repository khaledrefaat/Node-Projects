const express = require('express');
const HttpError = require('../models/http-error');
const { body } = require('express-validator');

const router = express.Router();

const { getPosts, postPosts } = require('../controllers/feed');

router.get('/', getPosts);
router.post(
  '/',
  [
    body('title', 'Please enter title with at least 3 chars.')
      .trim()
      .isLength({ min: 7 }),
    body('content', 'Please enter description with at least 10 chars.')
      .trim()
      .isLength({ min: 5 }),
  ],
  postPosts
);

module.exports = router;
