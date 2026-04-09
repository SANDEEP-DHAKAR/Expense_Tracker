const {
    createExpense,
    getExpenses,
    deleteExpense,
} = require('../models/expenseModel');

// ➕ ADD EXPENSE
const addExpense = async (userId, data) => {
    const { categoryId, amount, note, expenseDate } = data;

    // ✅ Validation
    if (!amount || amount <= 0) {
        throw new Error('Valid amount required');
    }

    if (!expenseDate) {
        throw new Error('Expense date required');
    }

    // ✅ Create
    const result = await createExpense(
        userId,
        categoryId,
        amount,
        note || null,
        expenseDate
    );

    return {
        success: true,
        id: result.insertId
    };
};

// 📥 GET EXPENSES
const fetchExpenses = async (userId) => {
    const data = await getExpenses(userId);

    return {
        success: true,
        count: data.length,
        data
    };
};

// ❌ DELETE EXPENSE
const removeExpense = async (id, userId) => {
    if (!id) {
        throw new Error('Expense ID required');
    }

    const result = await deleteExpense(id, userId);

    if (result.affectedRows === 0) {
        throw new Error('Expense not found or unauthorized');
    }

    return {
        success: true,
        message: 'Expense deleted successfully'
    };
};

module.exports = {
    addExpense,
    fetchExpenses,
    removeExpense
};