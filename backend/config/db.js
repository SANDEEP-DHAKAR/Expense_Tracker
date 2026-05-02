const mysql = require('mysql2');
require('dotenv').config();

const { DATABASE_URL } = process.env;

// ❗ check
if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL missing in environment variables');
    process.exit(1);
}

// ✅ connection pool using Railway URL
const db = mysql.createPool({
    uri: DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}).promise();

console.log('✅ Database connected using Railway URL');

module.exports = db;