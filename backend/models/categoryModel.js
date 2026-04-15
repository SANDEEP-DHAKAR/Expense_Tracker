const db = require('../config/db');

const insertCategory = async (userId, name) => {
    const query = `
        INSERT INTO categories (user_id, name)
        VALUES (?, ?)
    `;
    const [result] = await db.query(query, [userId, name]);
    return result;
};

const insertDefaultCategories = async (userId, categories) => {
    if (!Array.isArray(categories) || categories.length === 0) {
        return;
    }

    const query = `
        INSERT INTO categories (user_id, name)
        VALUES ?
    `;

    const values = categories.map((name) => [userId, name]);
    await db.query(query, [values]);
};

const getCategories = async (userId) => {
    const query = `
        SELECT id, name, created_at
        FROM categories
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;
    const [rows] = await db.query(query, [userId]);
    return rows;
};

const updateCategory = async (id, userId, name) => {
    const query = `
        UPDATE categories
        SET name = ?
        WHERE id = ? AND user_id = ?
    `;
    const [result] = await db.query(query, [name, id, userId]);
    return result;
};

const deleteCategory = async (id, userId) => {
    const query = `
        DELETE FROM categories
        WHERE id = ? AND user_id = ?
    `;
    const [result] = await db.query(query, [id, userId]);
    return result;
};

module.exports = {
    insertCategory,
    insertDefaultCategories,
    getCategories,
    updateCategory,
    deleteCategory
};
