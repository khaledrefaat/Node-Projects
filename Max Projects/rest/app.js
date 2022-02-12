const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URI = require('./config/keys');

const feedRoutes = require('./routes/feed');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, Post, Put, Patch, Delete'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/posts', feedRoutes);

app.use((err, req, res, next) => {
  res.status(err.code || 500);
  res.json({ message: err.message || 'An unknown error occurred.' });
});

mongoose
  .connect(MONGO_URI)
  .then(() => app.listen(9000))
  .catch(err => console.log(err));
