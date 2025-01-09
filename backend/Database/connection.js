const mysql = require('mysql')

const mysql_password = process.env.MYSQL_PASSWORD
const mysql_host = process.env.HOST
const mysql_user = process.env.USER
const mysql_database = process.env.DATABASE

const connection = mysql.createConnection({
    host: mysql_host,
    user: mysql_user,
    password: mysql_password,
    database: mysql_database
  })
  
  connection.connect((err) => {
    if (err) {
      console.log('Cannot connect to database');
    } else {
      console.log('Database connected');
    }
  })

  module.exports = { connection }