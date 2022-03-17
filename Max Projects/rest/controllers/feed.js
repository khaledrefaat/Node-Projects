const HttpError = require('../models/http-error');
const Post = require('../models/post');
const { validationResult } = require('express-validator');

exports.getPosts = async (req, res, next) => {
  let posts;
  try {
    posts = await Post.find();
  } catch (err) {
    console.log(err);
    next(new HttpError('Something went wrong, please try again later.'));
  }
  res.status(200).json({ posts });
};

exports.postPosts = async (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return next(new HttpError(validationErrors.array()[0].msg, 422));
  }

  const { title, content } = req.body;
  let post;

  try {
    post = new Post({
      title,
      content,
      creator: 'Khaled Elkady',
      imageUrl: '/images/dog.jpg',
    });
    await post.save();
  } catch (err) {
    console.log(err);
  }

  return res
    .status(201)
    .json({ message: 'Post Created Successfully ^_*', post });
};
