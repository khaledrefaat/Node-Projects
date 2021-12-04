const { Schema, model } = require('mongoose');

const articleSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: String,
});

module.exports = model('articles', articleSchema);
