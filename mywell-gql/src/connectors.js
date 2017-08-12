import Sequelize from 'sequelize';


const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USER = process.env.DB_USER;

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
});

class MySQLConnector {

}

export default MySQLConnector;
