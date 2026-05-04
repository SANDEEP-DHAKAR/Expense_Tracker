const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function test() {
    try {
        const db = await mysql.createConnection('mysql://appuser:RQcKUFTYuwWIFdYgzpukBvfspofYekdM@switchyard.proxy.rlwy.net:47360/railway');
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
