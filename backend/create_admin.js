require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./config/db');

async function createAdmin() {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'sandeep@gmail.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
        const adminName = process.env.ADMIN_NAME || 'Admin Sandeep';

        console.log(`🔐 Creating/updating superadmin account for: ${adminEmail}`);

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(adminPassword, salt);

        await db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin') ON DUPLICATE KEY UPDATE password = ?, role = 'admin', name = ?",
            [adminName, adminEmail, hash, hash, adminName]
        );

        console.log(`✅ Superadmin configured successfully in TiDB Cloud!`);
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
        process.exit(0);
    } catch (e) {
        console.error('❌ Failed to configure admin:', e);
        process.exit(1);
    }
}

createAdmin();
