const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_complete', 'root', 'k@5214705K', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
