const db = require('../config/db');

// 🥇 Create Category
const createCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;

        if (!name || name.trim() === '') {
            throw new Error("Category name required");
        }

        const query = `
            INSERT INTO categories (user_id, name)
            VALUES (?, ?)
        `;

        const [result] = await db.query(query, [userId, name]);

        res.json({
            success: true,
            message: "Category created successfully",
            id: result.insertId
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 🥈 Get Categories
const getCategories = async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `
            SELECT * FROM categories
            WHERE user_id = ?
            ORDER BY id DESC
        `;

        const [rows] = await db.query(query, [userId]);

        res.json({
            success: true,
            count: rows.length,
            data: rows
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ✏️ UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const { name } = req.body;

        // ✅ Validation
        if (!id) {
            throw new Error("Category ID required");
        }

        if (!name || name.trim() === '') {
            throw new Error("Category name required");
        }

        const query = `
            UPDATE categories
            SET name = ?
            WHERE id = ? AND user_id = ?
        `;

        const [result] = await db.query(query, [name, id, userId]);

        // ✅ Check ownership
        if (result.affectedRows === 0) {
            throw new Error("Category not found or unauthorized");
        }

        res.json({
            success: true,
            message: "Category updated successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 🥉 Delete Category (Secure)
const deleteCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        if (!id) {
            throw new Error("Category ID required");
        }

        const query = `
            DELETE FROM categories
            WHERE id = ? AND user_id = ?
        `;

        const [result] = await db.query(query, [id, userId]);

        if (result.affectedRows === 0) {
            throw new Error("Category not found or unauthorized");
        }

        res.json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};