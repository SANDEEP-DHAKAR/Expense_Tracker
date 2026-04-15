const {
    insertCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    insertDefaultCategories
} = require('../models/categoryModel');

// 🥇 CREATE CATEGORY
const createCategoryService = async (userId, data) => {
    const { name } = data;

    if (!name || name.trim() === '') {
        const error = new Error('Category name required');
        error.status = 400;
        throw error;
    }

    const result = await insertCategory(userId, name);

    return {
        success: true,
        message: 'Category created successfully',
        id: result.insertId
    };
};

// 🔥 DEFAULT CATEGORIES AUTO INSERT
const createDefaultCategories = async (userId) => {
    const defaultCategories = ['Food', 'Travel', 'Shopping', 'Bills'];
    await insertDefaultCategories(userId, defaultCategories);
};

// 🥈 GET ALL CATEGORIES (USER WISE)
const getCategoriesService = async (userId) => {
    const rows = await getCategories(userId);
    return {
        success: true,
        count: rows.length,
        data: rows
    };
};

// 🥉 DELETE CATEGORY
const deleteCategoryService = async (id, userId) => {
    if (!id) {
        const error = new Error('Category ID required');
        error.status = 400;
        throw error;
    }

    const result = await deleteCategory(id, userId);
    if (result.affectedRows === 0) {
        const error = new Error('Category not found or unauthorized');
        error.status = 404;
        throw error;
    }

    return {
        success: true,
        message: 'Category deleted successfully'
    };
};

// ✏️ UPDATE CATEGORY
const updateCategoryService = async (id, userId, data) => {
    const { name } = data;

    if (!id) {
        const error = new Error('Category ID required');
        error.status = 400;
        throw error;
    }

    if (!name || name.trim() === '') {
        const error = new Error('Category name required');
        error.status = 400;
        throw error;
    }

    const result = await updateCategory(id, userId, name);
    if (result.affectedRows === 0) {
        const error = new Error('Category not found or unauthorized');
        error.status = 404;
        throw error;
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
    updateCategoryService,
    createDefaultCategories
};