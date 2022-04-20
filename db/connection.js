// require MySql to create the connection to server
const mysql = require('mysql2');
// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'Unebellevie2018$inchalah',
    database: 'election'
  },
  console.log('Connected to the election database.')
);

module.exports = db;