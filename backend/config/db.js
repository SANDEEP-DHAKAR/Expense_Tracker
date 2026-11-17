const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const {
    DATABASE_URL,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_SSL
} = process.env;

// Validate that connection credentials exist
if (!DATABASE_URL && !DB_HOST) {
    console.error('❌ Database configuration missing: Provide either DATABASE_URL or DB_HOST in environment variables.');
    process.exit(1);
}

// Build pool configuration
const poolConfig = {
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000, // 10s keepalive prevents TiDB Serverless idle timeouts
};

if (DATABASE_URL) {
    poolConfig.uri = DATABASE_URL;
} else {
    poolConfig.host = DB_HOST || 'localhost';
    poolConfig.port = Number(DB_PORT || 4000);
    poolConfig.user = DB_USER || 'root';
    poolConfig.password = DB_PASSWORD || '';
    poolConfig.database = DB_NAME || 'test';
}

// SSL Configuration: Required for TiDB Cloud Serverless & cloud providers
const isTiDB = (DATABASE_URL && DATABASE_URL.includes('tidbcloud.com')) || (DB_HOST && DB_HOST.includes('tidbcloud.com'));
const isSSLRequired = isTiDB ||
    (DATABASE_URL && (DATABASE_URL.includes('aivencloud.com') || DATABASE_URL.includes('ssl='))) ||
    DB_SSL === 'true';

if (isSSLRequired) {
    poolConfig.ssl = {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
    };
}

const rawPool = mysql.createPool(poolConfig);

// Catch idle client errors so the server doesn't crash on network blips
rawPool.on('error', (err) => {
    console.warn('⚠️ Unexpected database pool error:', err.message);
});

const db = rawPool.promise();

console.log(`✅ Database connection pool initialized (${isTiDB ? 'TiDB Cloud Serverless [SSL]' : 'MySQL'})`);

// Required core tables for Expense Tracker
const REQUIRED_TABLES = [
    'users',
    'categories',
    'expenses',
    'budgets',
    'notifications',
    'refresh_tokens',
    'password_reset_tokens'
];

// Auto-initialize missing tables from schema.sql
const initSchemaIfEmpty = async () => {
    try {
        const [tables] = await db.query('SHOW TABLES');
        const existingTableNames = tables.map(t => Object.values(t)[0].toLowerCase());
        
        const missingTables = REQUIRED_TABLES.filter(t => !existingTableNames.includes(t));

        if (missingTables.length > 0) {
            console.log(`⚡ Missing database tables detected: [${missingTables.join(', ')}]. Auto-initializing from schema.sql...`);
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
                console.log('✅ Missing tables auto-initialized successfully in TiDB Cloud!');
            }
        } else {
            console.log(`📊 Connected to TiDB Cloud with all ${existingTableNames.length} tables verified.`);
        }
    } catch (err) {
        console.warn('⚠️ Database schema verification notice:', err.message);
    }
};

initSchemaIfEmpty();

module.exports = db;
