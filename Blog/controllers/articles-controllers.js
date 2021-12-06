const Article = require('../models/article');
const User = require('../models/user');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

exports.getArticles = (req, res, next) => {
  Article.find({})
    .then(articles => {
      res.json(articles);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getArticlesByUserId = async (req, res, next) => {
  const { userId } = req.params;

  let user;
  try {
    user = await User.findById(userId).populate('articles');
  } catch (err) {
    console.log(err);
    return next(new HttpError('Something went wrong, try again later.', 500));
  }

  if (!user)
    return next(
      new HttpError('Could not find a place with the provided user id.', 404)
    );

  res.json(user.articles);
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
    const session = await mongoose.startSession();
    session.startTransaction();
    user.articles.push(article);
    await user.save();
    session.commitTransaction();
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
    article = await Article.findById(id).populate('creator');
  } catch (err) {
    console.log(err);
  }

  if (!article)
    return next(new HttpError("couldn't delete this article!", 400));

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    article.remove({ session });
    article.creator.articles.pull(article);
    article.creator.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Something went wrong, try again later.', 500));
  }
  res.json({ message: 'Article Deleted -_-' });
};
