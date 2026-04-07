const db = require('../config/db');

// Create User
const createUser = (name, email, password) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)';
        db.query(query, [name, email, password], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Find User by Email
const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Users WHERE email = ?';
        db.query(query, [email], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};

module.exports = { createUser, findUserByEmail };