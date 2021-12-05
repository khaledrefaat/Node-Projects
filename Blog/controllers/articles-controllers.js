const { findById } = require('../models/article');
const Article = require('../models/article');
const HttpError = require('../models/http-error');

exports.getArticles = (req, res, next) => {
  Article.find({})
    .then(articles => {
      res.json(articles);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postArticle = (req, res, next) => {
  const reqBody = req.body;
  const article = new Article({
    title: reqBody.title,
    description: reqBody.description,
    imageUrl: reqBody.image || null,
  });
  article
    .save()
    .then(() => {
      res.json({ Message: 'Done' });
    })
    .catch(err => console.log(err));
};

exports.getEditArticle = async (req, res, next) => {
  const { id } = req.params;

  let article;
  try {
    article = await Article.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!article) return next(new HttpError("couldn't find this article!", 400));

  res.json(article);
};

exports.editArticle = async (req, res, next) => {
  const { id } = req.params;
  const reqBody = req.body;

  let article;
  try {
    article = await Article.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!article) return next(new HttpError("couldn't find this article!", 400));

  article.title = reqBody.title;
  article.description = reqBody.description;
  article.imageUrl = reqBody.image || null;

  try {
    await article.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError("couldn't update this article!", 400));
  }
  res.json({ message: 'Article Updated ^_^' });
};

exports.deleteArticle = async (req, res, next) => {
  const { id } = req.params;

  let article;

  try {
    article = await Article.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!article)
    return next(new HttpError("couldn't delete this article!", 400));

  try {
    await Article.findByIdAndRemove(id, { useFindAndModify: false });
  } catch (err) {
    console.log(err);
  }
  res.json({ message: 'Article Deleted -_-' });
};
