const Post = require('../models/posts');

exports.getPosts = (req, res, next) => {
  const posts = Post.find();
  res.status(200).json(posts);
};

exports.postPosts = async (req, res, next) => {
  const { title, content } = req.body;
  let post;
  try {
    post = new Post({ title, content });
    await post.save();
  } catch (err) {
    console.log(err);
  }

  return res.status(201).json({ message: 'Post Created Successfully', post });
};
