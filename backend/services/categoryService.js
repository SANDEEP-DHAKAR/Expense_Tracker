const db = require('../config/db');

// 🥇 CREATE CATEGORY
const createCategoryService = async (userId, data) => {
    const { name } = data;

    // ✅ Validation
    if (!name || name.trim() === '') {
        throw new Error('Category name required');
    }

    const query = `
        INSERT INTO categories (user_id, name)
        VALUES (?, ?)
    `;

    const [result] = await db.query(query, [userId, name]);

    return {
        success: true,
        message: 'Category created successfully',
        id: result.insertId
    };
};

// 🔥 DEFAULT CATEGORIES AUTO INSERT
const createDefaultCategories = async (userId) => {
    const defaultCategories = ["Food", "Travel", "Shopping", "Bills"];

    const query = `
        INSERT INTO categories (user_id, name)
        VALUES ?
    `;

    const values = defaultCategories.map(name => [userId, name]);

    await db.query(query, [values]);
};

// 🥈 GET ALL CATEGORIES (USER WISE)
const getCategoriesService = async (userId) => {
    const query = `
        SELECT * FROM categories
        WHERE user_id = ?
        ORDER BY id DESC
    `;

    const [rows] = await db.query(query, [userId]);

    return {
        success: true,
        count: rows.length,
        data: rows
    };
};

// 🥉 DELETE CATEGORY
const deleteCategoryService = async (id, userId) => {
    if (!id) {
        throw new Error('Category ID required');
    }

    const query = `
        DELETE FROM categories
        WHERE id = ? AND user_id = ?
    `;

    const [result] = await db.query(query, [id, userId]);

    if (result.affectedRows === 0) {
        throw new Error('Category not found or unauthorized');
    }

    return {
        success: true,
        message: 'Category deleted successfully'
    };
};

// ✏️ UPDATE CATEGORY (BONUS - PRO LEVEL)
const updateCategoryService = async (id, userId, data) => {
    const { name } = data;

    if (!id) {
        throw new Error('Category ID required');
    }

    if (!name || name.trim() === '') {
        throw new Error('Category name required');
    }

    const query = `
        UPDATE categories
        SET name = ?
        WHERE id = ? AND user_id = ?
    `;

    const [result] = await db.query(query, [name, id, userId]);

    if (result.affectedRows === 0) {
        throw new Error('Category not found or unauthorized');
    }

    return {
        success: true,
        message: 'Category updated successfully'
    };
};

module.exports = {
    createCategoryService,
    getCategoriesService,
    deleteCategoryService,
    updateCategoryService
};