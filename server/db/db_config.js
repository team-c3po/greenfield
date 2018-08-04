const mysql = require('mysql');

let dbConfig;

try {
    dbConfig = require('./config.js').dbConfig
} catch (err) {
    dbConfig = process.env.dbConfig
} 

const db = mysql.createPool(dbConfig);

module.exports = db;