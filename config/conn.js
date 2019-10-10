const mysql = require('mysql');
const config = require('./database.js');

const pool = mysql.createPool({
  connectionLimit : 10,
  host            : config.hostname,
  user            : config.username,
  password        : config.pass,
  database        : config.db
});

module.exports = pool;
