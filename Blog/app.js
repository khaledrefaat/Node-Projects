const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');

const MONGODB_URI = 'mongodb://localhost:27017/test';

const articleRouter = require('./routes/articles-routes');
const userRouter = require('./routes/users-routes');

app.use(bodyParser.json());

app.use('/users', userRouter);
app.use('/articles', articleRouter);

app.get('/', (req, res, next) => {
  res.render('index');
});

app.use((req, res, next) => {
  throw new HttpError('Couldnt find this route.');
});

app.use((err, req, res, next) => {
  res.status(err.code || 500);
  res.json({ message: err.message || 'An unknown error occurred!' });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(9000))
  .catch(err => console.log(err));
