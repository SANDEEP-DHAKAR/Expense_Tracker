const mysql = require('mysql2/promise');
require('dotenv').config();

const { DATABASE_URL } = process.env;

async function createPasswordResetTable() {
    let connection;
    try {
        connection = await mysql.createConnection(DATABASE_URL);
        console.log('✅ Connected to database');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS password_reset_tokens (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                token VARCHAR(255) NOT NULL,
                expires_at DATETIME NOT NULL,
                used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_token (token),
                INDEX idx_user_id (user_id)
            )
        `;

        await connection.query(createTableQuery);
        console.log('✅ password_reset_tokens table created successfully');

    } catch (error) {
        console.error('❌ Error creating table:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔒 Database connection closed');
        }
    }
}

createPasswordResetTable();