require('dotenv').config();
const db = require('./config/db');

async function test() {
    try {
        console.log('🔍 Testing TiDB Cloud connection & queries...');
        
        const [version] = await db.query('SELECT VERSION() as version');
        console.log('📌 Database Engine Version:', version[0].version);

        const [tables] = await db.query('SHOW TABLES');
        console.log(`📋 Total Tables (${tables.length}):`, tables.map(t => Object.values(t)[0]));

        const [users] = await db.query('SELECT id, name, email, role, created_at FROM users');
        console.log(`👥 Registered Users (${users.length}):`, users);

        const [categories] = await db.query('SELECT count(*) as count FROM categories');
        console.log(`🏷️ Total Categories: ${categories[0].count}`);

        const [expenses] = await db.query('SELECT count(*) as count FROM expenses');
        console.log(`💰 Total Expenses: ${expenses[0].count}`);

        console.log('✅ TiDB Cloud is 100% active, healthy and fully accessible!');
        process.exit(0);
    } catch (e) {
        console.error('❌ TiDB Cloud Test Error:', e);
        process.exit(1);
    }
}

test();
