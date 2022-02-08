const express = require('express');

const router = express.Router();

const { getPosts, postPosts } = require('../controllers/feed');

router.get('/', getPosts);
router.post('/', postPosts);

module.exports = router;
