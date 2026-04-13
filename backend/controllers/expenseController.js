const {
    addExpense,
    fetchExpenses,
    removeExpense,
    editExpense
} = require('../services/expenseService');

// ➕ ADD EXPENSE
const create = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await addExpense(userId, req.body);

        return res.status(201).json({
            success: true,
            message: 'Expense added successfully',
            ...result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 📥 GET ALL EXPENSES (WITH FILTER)
const getAll = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await fetchExpenses(userId, req.query);

        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ✏️ UPDATE EXPENSE
const edit = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenseId = req.params.id;

        const result = await editExpense(expenseId, userId, req.body);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ❌ DELETE EXPENSE
const remove = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenseId = req.params.id;

        const result = await removeExpense(expenseId, userId);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const db = require('../config/db');

// 🔥 Get expenses by category
const getExpensesByCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const categoryId = req.params.categoryId;

        const query = `
            SELECT 
                e.*, 
                c.name AS category_name
            FROM expenses e
            JOIN categories c ON e.category_id = c.id
            WHERE e.user_id = ? AND e.category_id = ?
        `;

        const [rows] = await db.query(query, [userId, categoryId]);

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

module.exports = {
    create,
    getAll,
    remove,
    edit,
    getExpensesByCategory
};
