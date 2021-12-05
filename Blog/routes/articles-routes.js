const express = require('express');
const router = express.Router();

const {
  postArticle,
  getArticles,
  getEditArticle,
  editArticle,
  deleteArticle,
} = require('../controllers/articles-controllers');

router.get('/', getArticles);

router.post('/new', postArticle);

router.get('/edit/:id', getEditArticle);

router.patch('/edit/:id', editArticle);

router.delete('/:id', deleteArticle);

module.exports = router;
