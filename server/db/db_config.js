const mysql = require('mysql');

let dbConfig;

try {
    dbConfig = require('./config.js').dbConfig
} catch {
    dbConfig = process.env.dbConfig
} 

const db = mysql.createPool(dbConfig);

module.exports = db;