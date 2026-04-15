const mysql = require('mysql2');
require('dotenv').config();

const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    NODE_ENV,
} = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    console.error('❌ Missing DB configuration. Please set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME.');
    process.exit(1);
}

if (NODE_ENV === 'production' && DB_HOST === 'localhost') {
    console.error('❌ DB_HOST is set to localhost in production. Render cannot connect to your local database. Set DB_HOST to a remote database host accessible from Render.');
}

const db = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}).promise();

console.log('✅ Database connection pool created successfully');

module.exports = db;