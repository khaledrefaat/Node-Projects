const { Schema, model, Types } = require('mongoose');

const userSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  articles: [
    {
      type: Types.ObjectId,
      required: true,
      ref: 'Article',
    },
  ],
});

module.exports = model('User', userSchema);
