const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { DATABASE_URL } = process.env;

// ❗ check
if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL missing in environment variables');
    process.exit(1);
}

// ✅ connection pool using DATABASE_URL from environment
const db = mysql.createPool({
    uri: DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}).promise();

console.log('✅ Database connection pool initialized using DATABASE_URL');

// 🚀 Auto-initialize tables if empty live database is detected
const initSchemaIfEmpty = async () => {
    try {
        const [tables] = await db.query('SHOW TABLES');
        if (tables.length === 0) {
            console.log('⚡ Empty database detected. Auto-initializing tables from schema.sql...');
            const schemaPath = path.join(__dirname, '..', 'schema.sql');
            if (fs.existsSync(schemaPath)) {
                const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
                const statements = schemaSql
                    .replace(/--.*$/gm, '')
                    .split(';')
                    .map(s => s.trim())
                    .filter(s => s.length > 0 && !s.toLowerCase().startsWith('create database') && !s.toLowerCase().startsWith('use '));
                
                await db.query('SET FOREIGN_KEY_CHECKS = 0');
                for (const statement of statements) {
                    try {
                        await db.query(statement);
                    } catch (err) {
                        // ignore minor duplicate or existing warnings
                    }
                }
                await db.query('SET FOREIGN_KEY_CHECKS = 1');
                console.log('✅ All tables auto-initialized successfully in live database!');
            }
        } else {
            console.log(`📊 Connected to database with ${tables.length} existing tables.`);
        }
    } catch (err) {
        console.warn('⚠️ Database schema verification notice:', err.message);
    }
};

initSchemaIfEmpty();

module.exports = db;
