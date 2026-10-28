require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const { DATABASE_URL } = process.env;

async function initDatabase() {
    console.log('🚀 Connecting to database using DATABASE_URL...');
    
    if (!DATABASE_URL) {
        console.error('❌ DATABASE_URL is missing in .env');
        process.exit(1);
    }

    let connection;
    try {
        connection = await mysql.createConnection(DATABASE_URL);
        console.log('✅ Connected successfully to MySQL server!');

        const [tables] = await connection.query('SHOW TABLES');
        console.log(`📊 Existing tables count: ${tables.length}`);

        // Read schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
            
            // Split by statement (semicolon at end of line)
            const statements = schemaSql
                .replace(/--.*$/gm, '') // Remove comments
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0 && !s.toLowerCase().startsWith('create database') && !s.toLowerCase().startsWith('use '));

            console.log(`⚙️ Executing ${statements.length} schema statements...`);
            
            await connection.query('SET FOREIGN_KEY_CHECKS = 0');
            for (const statement of statements) {
                try {
                    await connection.query(statement);
                } catch (stmtErr) {
                    console.warn(`⚠️ Statement warning: ${stmtErr.message}`);
                }
            }
            await connection.query('SET FOREIGN_KEY_CHECKS = 1');

            const [updatedTables] = await connection.query('SHOW TABLES');
            console.log('✅ Database initialized successfully! Tables now in database:');
            console.table(updatedTables);
        } else {
            console.warn('⚠️ schema.sql file not found in backend folder.');
        }

    } catch (error) {
        console.error('❌ Database connection or initialization error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔒 Connection closed.');
        }
    }
}

initDatabase();

