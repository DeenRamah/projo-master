const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

// Load configuration
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const { host, user, password, database, port } = config.database;

// Initialize Sequelize
const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: 'mysql',
  port,
  logging: false,
  dialectOptions: {
    connectTimeout: 30000 // Set a reasonable connection timeout
  }
});

// Function to initialize the database
const initializeDatabase = async () => {
  try {
    console.log('Attempting to connect to the database...');
    await sequelize.authenticate();
    console.log('Database connection successful.');

    console.log('Syncing database models...');
    await sequelize.sync({ force: false });
    console.log('Database models synced successfully.');
  } catch (error) {
    console.error('Database connection failure:', error.message);
    process.exit(1); // Exit the process if a connection cannot be established
  }
};

// Ensure database exists before attempting to connect
const dbinit = require('./init');
(async () => {
  try {
    await dbinit.createDatabase();
    console.log('Database initialized successfully.');
    await initializeDatabase();
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  }
})();

module.exports = sequelize;
