const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = cb => {
  MongoClient.connect(
    'mongodb+srv://khaledrefaat:5214705@cluster0.nos6l.mongodb.net/shop?retryWrites=true&w=majority',
    { useUnifiedTopology: true }
  )
    .then(client => {
      console.log('connected');
      _db = client.db();
      cb();
    })
    .catch(err => console.log(err));
};

const getDb = () => {
  if (_db) return _db;
  throw 'No Database Were Found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
