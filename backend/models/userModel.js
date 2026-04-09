const db = require('../config/db');

// Create User
const createUser = async (name, email, password) => {
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [name, email, password]);
    return result;
};

// Find User by Email
const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.query(query, [email]);
    return rows[0];
};

module.exports = { createUser, findUserByEmail };