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

// Find User by ID
const findUserById = async (id) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

// Update User Password
const updateUserPassword = async (id, password) => {
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    const [result] = await db.query(query, [password, id]);
    return result;
};

module.exports = { createUser, findUserByEmail, findUserById, updateUserPassword };
