const db = require("../config/db");

const getBudgetStatus = async (userId, month = new Date().toISOString().slice(0, 7)) => {
    const [budgetRows] = await db.query(
        `SELECT monthly_limit FROM budgets WHERE user_id = ? AND month = ?`,
        [userId, month]
    );

    const budget = Number(budgetRows[0]?.monthly_limit || 0);

    const [expenseRows] = await db.query(
        `SELECT COALESCE(SUM(amount), 0) AS total_spent
         FROM expenses
         WHERE user_id = ?
         AND DATE_FORMAT(expense_date, '%Y-%m') = ?`,
        [userId, month]
    );

    const spent = Number(expenseRows[0]?.total_spent || 0);
    const remaining = budget - spent;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    const status = remaining < 0 ? "over" : "safe";

    let alert = null;

    if (budget > 0) {
        if (percentage >= 100) {
            alert = {
                type: "danger",
                message: "Budget exceeded 💀"
            };
        } else if (percentage >= 80) {
            alert = {
                type: "warning",
                message: "80% budget used ⚠️"
            };
        }
    }

    return {
        budget,
        spent,
        remaining,
        status,
        used_percentage: Number(percentage.toFixed(2)),
        alert
    };
};

const setBudget = async (userId, monthly_limit, month) => {
    if (!monthly_limit || Number(monthly_limit) <= 0) {
        const error = new Error("Valid monthly_limit is required");
        error.status = 400;
        throw error;
    }

    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!month || !monthRegex.test(month)) {
        const error = new Error("Month is required in YYYY-MM format");
        error.status = 400;
        throw error;
    }

    const query = `
        INSERT INTO budgets (user_id, monthly_limit, month)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE monthly_limit = ?
    `;

    await db.query(query, [userId, monthly_limit, month, monthly_limit]);

    return {
        success: true,
        month,
        monthly_limit: Number(monthly_limit)
    };
};

const getBudgetHistory = async (userId, page = 1, limit = 12) => {
    const pageNumber = Number(page) >= 1 ? Number(page) : 1;
    const pageSize = Math.min(Math.max(Number(limit) || 12, 1), 50);
    const offset = (pageNumber - 1) * pageSize;

    const [rows] = await db.query(
        `SELECT month, monthly_limit, created_at, updated_at
         FROM budgets
         WHERE user_id = ?
         ORDER BY month DESC
         LIMIT ? OFFSET ?`,
        [userId, pageSize, offset]
    );

    const [countRows] = await db.query(
        `SELECT COUNT(*) AS total FROM budgets WHERE user_id = ?`,
        [userId]
    );

    return {
        data: rows,
        total: countRows[0]?.total || 0,
        page: pageNumber,
        limit: pageSize
    };
};

const ensureMonthlyBudget = async (userId, month) => {
    const [currentBudget] = await db.query(
        `SELECT monthly_limit FROM budgets WHERE user_id = ? AND month = ?`,
        [userId, month]
    );

    if (currentBudget.length > 0) {
        return Number(currentBudget[0].monthly_limit);
    }

    const [previousBudget] = await db.query(
        `SELECT monthly_limit FROM budgets WHERE user_id = ? ORDER BY month DESC LIMIT 1`,
        [userId]
    );

    const monthly_limit = Number(previousBudget[0]?.monthly_limit || 0);

    if (monthly_limit > 0) {
        await db.query(
            `INSERT INTO budgets (user_id, monthly_limit, month) VALUES (?, ?, ?)`,
            [userId, monthly_limit, month]
        );
    }

    return monthly_limit;
};

module.exports = {
    getBudgetStatus,
    setBudget,
    getBudgetHistory,
    ensureMonthlyBudget
};