const { Schema, model, Types } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: Types.ObjectId,
      required: true,
      ref: 'Post',
    },
  ],
});

module.exports = model('User', userSchema);
