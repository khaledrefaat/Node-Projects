const { Schema, model } = require('mongoose');

const generateModel = (type = String, required = true) => {
  return { type, required };
};

const postSchema = new Schema(
  {
    title: generateModel(),
    content: generateModel(),
    creator: generateModel(),
    imageUrl: generateModel(),
  },
  { timestamps: true }
);

module.exports = model('Post', postSchema);
