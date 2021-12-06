const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

const {
  getArticles,
  getArticlesByUserId,
  postArticle,
  getEditArticle,
  editArticle,
  deleteArticle,
} = require('../controllers/articles-controllers');

router.get('/', getArticles);

router.use(checkAuth);

router.get('/user/:userId', getArticlesByUserId);

router.post(
  '/new',
  [check('title').not().isEmpty(), check('description').not().isEmpty()],
  postArticle
);

router.get('/edit/:id', getEditArticle);

router.patch('/edit/:id', editArticle);

router.delete('/:id', deleteArticle);

module.exports = router;
