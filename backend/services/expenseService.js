const db = require("../config/db");

const {
    createExpense,
    getExpenses,
    getExpensesForExport,
    deleteExpense,
    updateExpense,
    getExpensesByCategory
} = require("../models/expenseModel");

const { createNotification } = require("./notificationService");

// ➕ ADD EXPENSE (WITH BUDGET ALERTS)
const addExpense = async (userId, data) => {
    const { categoryId, amount, note, expenseDate } = data;

    // ✅ VALIDATION
    if (!amount || Number(amount) <= 0) {
        const error = new Error("Valid amount required");
        error.status = 400;
        throw error;
    }

    if (!expenseDate) {
        const error = new Error("Expense date required");
        error.status = 400;
        throw error;
    }

    const result = await createExpense(
        userId,
        categoryId || null,
        amount,
        note || null,
        expenseDate
    );

    const monthKey = expenseDate.slice(0, 7);

    const [rows] = await db.query(
        `
        SELECT 
            b.monthly_limit,
            COALESCE(SUM(e.amount), 0) AS total_spent
        FROM budgets b
        LEFT JOIN expenses e 
            ON b.user_id = e.user_id 
            AND DATE_FORMAT(e.expense_date, '%Y-%m') = b.month
        WHERE b.user_id = ? AND b.month = ?
        GROUP BY b.monthly_limit
        `,
        [userId, monthKey]
    );

    let budget = 0;
    let spent = 0;
    let budgetPercentage = 0;
    let budgetExceeded = false;

    if (rows.length > 0) {
        const { monthly_limit, total_spent } = rows[0];
        budget = Number(monthly_limit);
        spent = Number(total_spent);
        budgetPercentage =
            monthly_limit > 0 ? (spent / monthly_limit) * 100 : 0;
        budgetExceeded = spent > monthly_limit;

        const previousSpent = spent - Number(amount);
        const thresholds = [0.8, 1.0];

        thresholds.forEach((threshold) => {
            const previousCrossed = previousSpent >= monthly_limit * threshold;
            const currentlyCrossed = spent >= monthly_limit * threshold;

            if (!previousCrossed && currentlyCrossed) {
                const message =
                    threshold === 1.0
                        ? "Budget exceeded 100% 🚨"
                        : "Budget usage above 80% ⚠️";

                createNotification(
                    userId,
                    threshold === 1.0 ? "danger" : "warning",
                    message
                ).catch(() => null);
            }
        });
    }

    return {
        success: true,
        id: result.insertId,
        budget: {
            budget,
            spent,
            budgetExceeded,
            budgetPercentage: Number(Math.min(budgetPercentage, 100).toFixed(2))
        }
    };
};

// 📥 GET EXPENSES (PAGINATION + FILTER READY)
const fetchExpenses = async (userId, query) => {
    const result = await getExpenses(userId, query);

    return {
        success: true,
        ...result,
    };
};

// � EXPORT EXPENSES
const exportExpenses = async (userId, query) => {
    const rows = await getExpensesForExport(userId, query);
    return rows;
};

// �📊 GET EXPENSES BY CATEGORY
const fetchExpensesByCategory = async (userId, categoryId) => {
    if (!categoryId) {
        const error = new Error("Category ID required");
        error.status = 400;
        throw error;
    }

    const rows = await getExpensesByCategory(userId, categoryId);
    return rows;
};

// ✏️ UPDATE EXPENSE
const editExpense = async (id, userId, data) => {
    const { categoryId, amount, note, expenseDate } = data;

    if (!id) {
        const error = new Error("Expense ID required");
        error.status = 400;
        throw error;
    }

    if (!amount || Number(amount) <= 0) {
        const error = new Error("Valid amount required");
        error.status = 400;
        throw error;
    }

    if (!expenseDate) {
        const error = new Error("Expense date required");
        error.status = 400;
        throw error;
    }

    const result = await updateExpense(
        id,
        userId,
        categoryId || null,
        amount,
        note || null,
        expenseDate
    );

    if (result.affectedRows === 0) {
        const error = new Error("Expense not found or unauthorized");
        error.status = 404;
        throw error;
    }

    return {
        success: true,
        message: "Expense updated successfully",
    };
};

// ❌ DELETE EXPENSE
const removeExpense = async (id, userId) => {
    if (!id) {
        const error = new Error("Expense ID required");
        error.status = 400;
        throw error;
    }

    const result = await deleteExpense(id, userId);

    if (result.affectedRows === 0) {
        const error = new Error("Expense not found or unauthorized");
        error.status = 404;
        throw error;
    }

    return {
        success: true,
        message: "Expense deleted successfully",
    };
};

module.exports = {
    addExpense,
    fetchExpenses,
    exportExpenses,
    fetchExpensesByCategory,
    removeExpense,
    editExpense,
};