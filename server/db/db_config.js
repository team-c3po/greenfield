const mysql = require('mysql');

const { dbConfig } = require('./config.js')

const db = mysql.createPool(dbConfig);

module.exports = db;