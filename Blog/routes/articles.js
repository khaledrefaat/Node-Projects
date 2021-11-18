const express = require('express');
const router = express.Router();

router.get('/new', (req, res, next) => {
  res.render('articles/new', { docTitle: 'New Blog' });
});

router.get('/', (req, res, next) => {
  const articles = [
    {
      title: 'Blog 1',
      description: `
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
      `,
      createdAt: new Date(),
    },
    {
      title: 'Blog 1',
      description: `
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
      `,
      createdAt: new Date(),
    },
    {
      title: 'Blog 1',
      description: `
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
      `,
      createdAt: new Date(),
    },
  ];

  res.render('articles/index', { articles, docTitle: 'Blog' });
});

module.exports = router;
