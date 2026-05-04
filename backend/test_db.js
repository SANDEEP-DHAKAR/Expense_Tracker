const mysql = require('mysql2/promise');

async function test() {
    try {
        const db = await mysql.createConnection('mysql://appuser:RQcKUFTYuwWIFdYgzpukBvfspofYekdM@switchyard.proxy.rlwy.net:47360/railway');
        const [rows] = await db.query('SELECT * FROM users');
        console.log("Users:", rows);
        await db.end();
    } catch (e) {
        console.error(e);
    }
}
test();
