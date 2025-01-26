const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

const database = process.env.DBNAME;
const username = process.env.DBUSERNAME;
const password = process.env.DBPASSWORD;

const init = {
    createDatabase:async()=> {
        try {
          const connection = await mysql.createConnection({ 
            host: '127.0.0.1', 
            user: username, 
            password: password 
          });
          await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
          await connection.end();
        } catch (error) {
          console.error('Error creating database', error);
          throw error;
        }
    }
}

module.exports = init
