const {
    addExpense,
    fetchExpenses,
    removeExpense,
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

// 📥 GET ALL EXPENSES
const getAll = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await fetchExpenses(userId);

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

module.exports = {
    create,
    getAll,
    remove
};