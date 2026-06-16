require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const { DATABASE_URL } = process.env;

async function test() {
    try {
        if (!DATABASE_URL) {
            throw new Error('DATABASE_URL missing in environment variables');
        }

        const db = await mysql.createConnection(DATABASE_URL);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('Admin12345', salt);
        await db.query("INSERT INTO users (name, email, password, role) VALUES ('Admin Sandeep', 'sandeep@gmail.com', ?, 'admin') ON DUPLICATE KEY UPDATE password = ?, role = 'admin'", [hash, hash]);
        console.log("Admin user created or updated");
        await db.end();
    } catch (e) {
        console.error(e);
    }
}
test();
