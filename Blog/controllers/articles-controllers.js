const Article = require('../models/article');
const User = require('../models/user');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

exports.getArticles = (req, res, next) => {
  Article.find({})
    .then(articles => {
      res.json(articles);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postArticle = async (req, res, next) => {
  const validationResultError = validationResult(req);

  if (!validationResultError.isEmpty())
    return next(new HttpError('Invalid Inputs.', 422));

  const { title, description, image, userId } = req.body;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    console.log(err);
    return next(new HttpError('Something went wrong, try again later.', 500));
  }

  const article = new Article({
    title: title,
    description: description,
    imageUrl: image || null,
    creator: userId,
  });

  try {
    await article.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Something went wrong, try again later.', 500));
  }
  try {
    user.articles.push(article);
    await user.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Something went wrong, try again later.', 500));
  }

  res.json({ article });
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
