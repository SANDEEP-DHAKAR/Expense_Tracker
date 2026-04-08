const mysql = require('mysql2');  // ⭐ YE MISSING THA
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

console.log('✅ Database connection pool created successfully');

module.exports = db;