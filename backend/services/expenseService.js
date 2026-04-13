const db = require('../config/db');

const {
    createExpense,
    getExpenses,
    deleteExpense,
    updateExpense
} = require('../models/expenseModel');

// ➕ ADD EXPENSE (FINAL)
const addExpense = async (userId, data) => {
    const { categoryId, amount, note, expenseDate } = data;

    // ✅ Validation
    if (!amount || amount <= 0) {
        throw new Error('Valid amount required');
    }

    if (!expenseDate) {
        throw new Error('Expense date required');
    }

    // ✅ Create Expense
    const result = await createExpense(
        userId,
        categoryId,
        amount,
        note || null,
        expenseDate
    );

    // 🔥 =========================
    // 🔔 BUDGET CHECK START
    // 🔥 =========================

    const currentMonth = expenseDate.slice(0, 7); // "YYYY-MM"

    const checkBudgetQuery = `
        SELECT 
            b.monthly_limit,
            COALESCE(SUM(e.amount), 0) AS total_spent
        FROM budgets b
        LEFT JOIN expenses e 
            ON b.user_id = e.user_id 
            AND DATE_FORMAT(e.expense_date, '%Y-%m') = b.month
        WHERE b.user_id = ? AND b.month = ?
        GROUP BY b.monthly_limit
    `;

    const [rows] = await db.query(checkBudgetQuery, [userId, currentMonth]);

    let budgetExceeded = false;
    let budgetAvailable = false;
    let budgetPercentage = 0;

    if (rows.length > 0) {
        budgetAvailable = true;

        const { monthly_limit, total_spent } = rows[0];

        if (monthly_limit > 0) {
            budgetPercentage = (total_spent / monthly_limit) * 100;
        }

        if (total_spent > monthly_limit) {
            budgetExceeded = true;
        }
    }

    // 🔥 =========================
    // 🔔 BUDGET CHECK END
    // 🔥 =========================

    return {
        success: true,
        id: result.insertId,
        budgetExceeded,
        budgetAvailable,
        budgetPercentage: Math.min(budgetPercentage, 100)
    };
};

// 📥 GET EXPENSES WITH FILTER
const fetchExpenses = async (userId, query) => {

    const result = await getExpenses(userId, query);

    return {
        success: true,
        ...result
    };
};

// ✏️ UPDATE EXPENSE
const editExpense = async (id, userId, data) => {
    const { categoryId, amount, note, expenseDate } = data;

    // ✅ Validation
    if (!id) {
        throw new Error('Expense ID required');
    }

    if (!amount || amount <= 0) {
        throw new Error('Valid amount required');
    }

    if (!expenseDate) {
        throw new Error('Expense date required');
    }

    const result = await updateExpense(
        id,
        userId,
        categoryId,
        amount,
        note || null,
        expenseDate
    );

    if (result.affectedRows === 0) {
        throw new Error('Expense not found or unauthorized');
    }

    return {
        success: true,
        message: 'Expense updated successfully'
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
    removeExpense,
    editExpense
};