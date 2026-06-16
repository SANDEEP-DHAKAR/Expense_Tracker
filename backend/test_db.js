require('dotenv').config();
const mysql = require('mysql2/promise');

const { DATABASE_URL } = process.env;

async function test() {
    try {
        if (!DATABASE_URL) {
            throw new Error('DATABASE_URL missing in environment variables');
        }

        const db = await mysql.createConnection(DATABASE_URL);
        const [rows] = await db.query('SELECT * FROM users');
        console.log("Users:", rows);
        await db.end();
    } catch (e) {
        console.error(e);
    }
}
test();
