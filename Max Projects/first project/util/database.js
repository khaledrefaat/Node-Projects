const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = cb => {
  MongoClient.connect(
    'mongodb+srv://khaledrefaat:5214705@cluster0.nos6l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
  )
    .then(client => {
      console.log('connected');
      cb(client);
    })
    .catch(err => console.log(err));
};

module.exports = mongoConnect;
