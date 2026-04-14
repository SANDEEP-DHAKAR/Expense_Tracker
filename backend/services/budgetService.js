const db = require('../config/db');

const getBudgetStatus = async (userId) => {
    const month = new Date().toISOString().slice(0, 7);

    // 💰 Budget
    const [budgetRows] = await db.query(
        `SELECT monthly_limit FROM budgets WHERE user_id = ? AND month = ?`,
        [userId, month]
    );

    const budget = Number(budgetRows[0]?.monthly_limit || 0);

    // 💸 Expense
    const [expenseRows] = await db.query(
        `SELECT COALESCE(SUM(amount), 0) AS total_spent
         FROM expenses
         WHERE user_id = ?
         AND DATE_FORMAT(expense_date, '%Y-%m') = ?`,
        [userId, month]
    );

    const spent = Number(expenseRows[0]?.total_spent || 0);

    // 🧮 Calculate
    const remaining = budget - spent;
    const status = remaining < 0 ? 'over' : 'safe';

    // 📊 Percentage
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;

    // 🚨 ALERT LOGIC (FIXED 💀)
    const { createNotification } = require('./notificationService');
    let alert = null;

    if (budget > 0) {
        if (percentage >= 100) {
            alert = {
                type: 'danger',
                message: 'Budget exceeded 💀'
            };
        } else if (percentage >= 80) {
            alert = {
                type: 'warning',
                message: '80% budget used ⚠️'
            };
        }
    }

    if (budget > 0) {
        if (percentage >= 100) {
            alert = {
                type: 'danger',
                message: 'Budget exceeded 💀'
            };

            await createNotification(userId, 'danger', alert.message);
        } else if (percentage >= 80) {
            alert = {
                type: 'warning',
                message: '80% budget used ⚠️'
            };

            await createNotification(userId, 'warning', alert.message);
        }
    }

    return {
        budget,
        spent,
        remaining,
        status,
        used_percentage: Number(percentage.toFixed(2)),
        alert,
    };
};

module.exports = {
    getBudgetStatus
};