const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dbinit = require('./init');
dbinit.createDatabase();

const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const { host, user, password, database, port } = config.database;

const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: 'mysql',
  port: port,
  logging: false
});

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database connection sucessful')
  })
  .catch((error) => {
    console.log('Database connection failure', error)
  })

module.exports = sequelize
