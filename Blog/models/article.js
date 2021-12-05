const { Schema, model, Types } = require('mongoose');

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
  creator: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = model('Article', articleSchema);
