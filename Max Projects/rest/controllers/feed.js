const HttpError = require('../models/http-error');
const Post = require('../models/posts');

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
  const { title, content } = req.body;
  let post;

  try {
    post = new Post({
      title,
      content,
      creator: 'Khaled Elkady',
      createdAt: new Date(),
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
