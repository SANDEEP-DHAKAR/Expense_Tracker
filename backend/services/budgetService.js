const db = require('../config/db');

const getBudgetStatus = async (userId) => {
    const month = new Date().toISOString().slice(0, 7);

    // 💰 Budget
    const budgetQuery = `
        SELECT monthly_limit 
        FROM budgets
        WHERE user_id = ? AND month = ?
    `;

    const [budgetRows] = await db.query(budgetQuery, [userId, month]);
    const budget = budgetRows[0]?.monthly_limit || 0;

    // 💸 Expense
    const expenseQuery = `
        SELECT COALESCE(SUM(amount), 0) AS total_spent
        FROM expenses
        WHERE user_id = ?
        AND DATE_FORMAT(expense_date, '%Y-%m') = ?
    `;

    const [expenseRows] = await db.query(expenseQuery, [userId, month]);
    const spent = expenseRows[0]?.total_spent || 0;

    // 🧮 Calculate
    const remaining = budget - spent;
    const status = remaining < 0 ? 'over' : 'safe';

    // 📊 Percentage (BONUS)
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;

    return {
        budget: Number(budget),
        spent: Number(spent),
        remaining: Number(remaining),
        status,
        used_percentage: Number(percentage.toFixed(2))
    };
};

module.exports = {
    getBudgetStatus
};