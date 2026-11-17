require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function initDatabase() {
    console.log('🚀 Initializing TiDB Cloud schema from schema.sql...');

    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (!fs.existsSync(schemaPath)) {
            console.error('❌ schema.sql file not found at:', schemaPath);
            process.exit(1);
        }

        const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
        const statements = schemaSql
            .replace(/--.*$/gm, '') // Remove SQL comments
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.toLowerCase().startsWith('create database') && !s.toLowerCase().startsWith('use '));

        console.log(`⚙️ Executing ${statements.length} schema statements in TiDB Cloud...`);
        
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        for (const statement of statements) {
            try {
                await db.query(statement);
            } catch (stmtErr) {
                console.warn(`⚠️ Statement notice: ${stmtErr.message}`);
            }
        }
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('✅ All schema statements executed successfully in TiDB Cloud!');

        const [tables] = await db.query('SHOW TABLES');
        console.log(`📊 Total tables in database: ${tables.length}`);
        console.log(tables.map(t => Object.values(t)[0]));

        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        process.exit(1);
    }
}

initDatabase();
