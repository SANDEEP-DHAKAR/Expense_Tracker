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
        SELECT c.id, c.name, c.created_at, 
               COUNT(e.id) AS expense_count, 
               COALESCE(SUM(e.amount), 0) AS total_spent
        FROM categories c
        LEFT JOIN expenses e ON e.category_id = c.id AND e.user_id = ?
        WHERE c.user_id = ? OR (c.user_id IS NULL AND NOT EXISTS (
            SELECT 1 FROM categories c2 WHERE c2.user_id = ? AND c2.name = c.name
        ))
        GROUP BY c.id, c.name, c.created_at
        ORDER BY c.created_at DESC
    `;
    const [rows] = await db.query(query, [userId, userId, userId]);
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
